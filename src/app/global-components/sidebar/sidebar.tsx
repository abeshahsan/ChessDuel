"use client";

import Link from "next/link";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import MailIcon from "@mui/icons-material/Mail";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { setSidebarOpen } from "@/app/store/client_socket_slice";
import {SportsEsports} from '@mui/icons-material';

export default function ResponsiveDrawer() {
	const dispatch = useDispatch();
	const sidebarOpen = useSelector((state: RootState) => state.clientSocket.sidebarOpen);

	const handleCloseSidebar = () => {
		dispatch(setSidebarOpen(false));
	};

	return (
		<>
			{/* Overlay */}
			{sidebarOpen && (
				<div
					className='fixed inset-0 bg-black opacity-50 z-10 md:hidden'
					onClick={handleCloseSidebar}
				></div>
			)}

			{/* Sidebar */}
			<div
				className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white ${
					sidebarOpen ? "block" : "hidden"
				} md:block z-20`}
			>
				<div className='p-4 border-b border-gray-700 mb-5'>
					<Link
						href='/'
						className='text-white text-2xl font-bold'
					>
						ChessDuel
					</Link>
				</div>
				<div className='p-2'>
					<Link
						href='/'
						className='flex items-center p-2 hover:bg-gray-800 rounded'
					>
						<HomeIcon className='h-5 w-5 mr-2' />
						<span>Home</span>
					</Link>
					<Link
						href='#'
						className='flex items-center p-2 hover:bg-gray-800 rounded'
					>
						<InfoIcon className='h-5 w-5 mr-2' />
						<span>About</span>
					</Link>
					<Link
						href='#'
						className='flex items-center p-2 hover:bg-gray-800 rounded'
					>
						<MailIcon className='h-5 w-5 mr-2' />
						<span>Contact</span>
					</Link>
					<Link
						href='/match/new'
						className='flex items-center p-2 hover:bg-gray-800 rounded'
					>
						<SportsEsports className='h-5 w-5 mr-2' />
						<span>New Match</span>
					</Link>
				</div>
			</div>
		</>
	);
}
