"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";

import ChessboardUI from "@/app/global-components/chessboard/chessboard";
import NewGameModal from "@/app/match/components/new-game-modal";
import AuthGuard from "@/app/components/AuthGuard";
import ProfileGuard from "@/app/components/ProfileGuard";
import { RootState } from "@/app/store";
import { addEventHandler, subscribe, unsubscribeComponent } from "@/app/store/client_socket_slice";
import { createMatch, MatchState } from "@/app/store/match_slice";
import { selectUserProfile } from "@/app/store/user_profile_slice";

import { Chess } from "chess.js";

const NewMatchContent = () => {
	const [isOpen, setIsOpen] = useState(true);
	const router = useRouter();

	const [game, setGame] = useState(new Chess());
	const [gameUrl, setGameUrl] = useState<string | null>(null);

	const dispatch = useDispatch();
	const socket = useSelector((state: RootState) => state.clientSocket.socket);
	const matchId = useSelector((state: RootState) => state.match.id);
	const userProfile = useSelector(selectUserProfile);
	const { data: session } = useSession();

	useEffect(() => {
		if (socket?.active && session?.user && userProfile) {
			console.log("Creating new match for user:", userProfile.ign);
			
			// Emit create-match with user profile information
			socket.emit("create-match", {
				userId: session.user.id,
				userName: userProfile.ign, // Use IGN instead of OAuth name
				userEmail: session.user.email,
			});
			
			dispatch(subscribe("NewMatchContent"));
				dispatch(
					addEventHandler({
						subscriberName: "NewMatchContent",
						event: "match-created",
						callback: (match: MatchState) => {
							const gameUrl = `${window.location.origin}/match/join/${match.id}`;
							setGameUrl(gameUrl);
							dispatch(createMatch(match));
						},
					})
				);
			dispatch(
				addEventHandler({
					subscriberName: "NewMatchContent",
					event: "match-joined",
					callback: (match: MatchState) => {
						console.log("Match joined by opponent: ", match);
						console.log("Players in match: ", match.players);
						setGameUrl(`${window.location.origin}/match/join/${match.id}`);
						dispatch(createMatch(match));
					},
				})
			);
			dispatch(
				addEventHandler({
					subscriberName: "NewMatchContent",
					event: "match-expired",
					callback: () => {
						alert("Match expired. Create a new one.");
						router.push("/match/new");
					},
				})
			);
			dispatch(
				addEventHandler({
					subscriberName: "NewMatchContent",
					event: "opponent-left",
					callback: (match: MatchState) => {
						dispatch(createMatch(match));
					},
				})
			);
			dispatch(
				addEventHandler({
					subscriberName: "NewMatchContent",
					event: "match-cancelled",
					callback: () => {
						alert("Match cancelled.");
						router.push("/");
					},
				})
			);
		}

		return () => {
			if (socket?.active) {
				dispatch(unsubscribeComponent("NewMatchContent"));
			}
		};
	}, [socket?.active, session?.user, userProfile, dispatch]);

	return (
		<div className={"w-3/4 md:w-2/5 h-screen mx-auto"}>
			<ChessboardUI
				game={game}
				setGame={setGame}
				matchId={matchId}
			/>
			<NewGameModal
				isOpen={isOpen}
				gameurl={gameUrl}
			/>
		</div>
	);
};

const NewMatch = () => {
	return (
		<AuthGuard>
			<ProfileGuard>
				<NewMatchContent />
			</ProfileGuard>
		</AuthGuard>
	);
};

export default NewMatch;
