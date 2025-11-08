"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ChessboardUI from "../../../global-components/chessboard/chessboard";
import NewGameModal from "../../components/new-game-modal";
import AuthGuard from "../../../components/AuthGuard";
import ProfileGuard from "../../../components/ProfileGuard";
import { Chess } from "chess.js";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { addEventHandler,  subscribe, unsubscribeComponent } from "../../../store/client_socket_slice";
import { createMatch, MatchState } from "../../../store/match_slice";
import { selectUserProfile } from "../../../store/user_profile_slice";

import { useParams } from "next/navigation";

const JoinMatchContent = () => {
	const [isOpen, setIsOpen] = useState(true);
	const router = useRouter();
	const params = useParams();
	const { data: session } = useSession();
	const userProfile = useSelector(selectUserProfile);

	const id = params?.id as string | undefined;
	
	// No longer using host info from URL; host identity comes from server get-match

	const [game, setGame] = useState(new Chess());
	const [gameUrl, setGameUrl] = useState<string | null>(null);

	const socket = useSelector((state: RootState) => state.clientSocket.socket);
	const dispatch = useDispatch();

	const joinEmittedRef = useRef(false);

	useEffect(() => {
		if (socket?.active && session?.user && userProfile && id && !joinEmittedRef.current) {
			console.log("Joining match:", id, "as user:", userProfile.ign);
			// Host info is fetched from server via get-match
			
			dispatch(subscribe("JoinMatchContent"));
			dispatch(
				addEventHandler({
					subscriberName: "JoinMatchContent",
					event: "match-joined",
					callback: (match: MatchState) => {
						console.log("Match joined successfully: ", match);
						console.log("Players in joined match: ", match.players);
						setGameUrl(window.location.origin + "/match/join/" + match.id);
						dispatch(createMatch(match));
					},
				})
			);
			dispatch(
				addEventHandler({
					subscriberName: "JoinMatchContent",
					event: "match-found",
					callback: (match: MatchState) => {
						console.log("Match found, displaying current state: ", match);
						setGameUrl(window.location.origin + "/match/join/" + match.id);
						dispatch(createMatch(match));
					},
				})
			);
			dispatch(
				addEventHandler({
					subscriberName: "JoinMatchContent",
					event: "match-not-found",
					callback: () => {
						console.log("Match not found");
						router.push("/match/new");
					},
				})
			);
			dispatch(
				addEventHandler({
					subscriberName: "JoinMatchContent",
					event: "match-full",
					callback: () => {
						alert("This match is already full.");
						router.push("/");
					},
				})
			);
			dispatch(
				addEventHandler({
					subscriberName: "JoinMatchContent",
					event: "match-expired",
					callback: () => {
						alert("This match invite has expired.");
						router.push("/match/new");
					},
				})
			);
			dispatch(
				addEventHandler({
					subscriberName: "JoinMatchContent",
					event: "unauthorized",
					callback: () => {
						alert("You must be signed in to join.");
						router.push("/auth/sign-in?callbackUrl=" + encodeURIComponent(window.location.pathname + window.location.search));
					},
				})
			);
			dispatch(
				addEventHandler({
					subscriberName: "JoinMatchContent",
					event: "match-already-started",
					callback: () => {
						alert("Match already started.");
						router.push("/");
					},
				})
			);
			dispatch(
				addEventHandler({
					subscriberName: "JoinMatchContent",
					event: "self-join-blocked",
					callback: () => {
						alert("You cannot join your own match.");
						router.push("/");
					},
				})
			);
			
			// First get the current match state
			socket.emit("get-match", id);
			
			// Then try to join with user profile information
			socket.emit("join-match", id, {
				userId: session.user.id,
				userName: userProfile.ign, // Use IGN instead of OAuth name
				userEmail: session.user.email,
			});
			joinEmittedRef.current = true;
		}

		return () => {
			if (socket?.active) {
				dispatch(unsubscribeComponent("JoinMatchContent"));
			}
		};
	}, [socket?.active, session?.user, userProfile, id, dispatch, router]);

	return (
		<div className={"w-3/4 md:w-2/5 h-screen mx-auto"}>
			<ChessboardUI
				game={game}
				setGame={setGame}
				matchId={id as string}
			/>
			<NewGameModal
				isOpen={isOpen}
				gameurl={gameUrl}
			/>
		</div>
	);
};

const JoinMatch = () => {
	return (
		<AuthGuard>
			<ProfileGuard>
				<JoinMatchContent />
			</ProfileGuard>
		</AuthGuard>
	);
};

export default JoinMatch;
