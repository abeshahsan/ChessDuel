"use client";

import React, { useState } from "react";
import {
	Box,
	Card,
	CardContent,
	Typography,
	TextField,
	Button,
	Alert,
	Divider,
	Avatar,
	Stack,
	Chip,
	Paper,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import AuthGuard from "@/app/components/AuthGuard";
import ProfileGuard from "@/app/components/ProfileGuard";
import {
	selectUserProfile,
	selectProfileError,
	selectProfileLoading,
	updateUserProfile,
	clearError,
} from "@/app/store/user_profile_slice";
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from "@mui/icons-material";

function ProfilePageContent() {
	const { data: session } = useSession();
	const dispatch = useDispatch();
	const userProfile = useSelector(selectUserProfile);
	const error = useSelector(selectProfileError);
	const isLoading = useSelector(selectProfileLoading);

	const [isEditing, setIsEditing] = useState(false);
	const [newIgn, setNewIgn] = useState(userProfile?.ign || "");

	const handleEdit = () => {
		setIsEditing(true);
		setNewIgn(userProfile?.ign || "");
		if (error) {
			dispatch(clearError());
		}
	};

	const handleSave = () => {
		if (!newIgn.trim() || newIgn.trim() === userProfile?.ign) {
			setIsEditing(false);
			return;
		}

		dispatch(updateUserProfile({ ign: newIgn.trim() }));
		setIsEditing(false);
	};

	const handleCancel = () => {
		setIsEditing(false);
		setNewIgn(userProfile?.ign || "");
		if (error) {
			dispatch(clearError());
		}
	};

	const handleIgnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		const sanitized = value.replace(/[^a-zA-Z0-9_-]/g, "");
		setNewIgn(sanitized);

		if (error) {
			dispatch(clearError());
		}
	};

	if (!session || !userProfile) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
				<Typography
					variant='h6'
					color='text.secondary'
				>
					Loading profile...
				</Typography>
			</Box>
		);
	}

	const displayName = userProfile.ign;
	const userInitials =
		displayName.length >= 2 ? displayName.substring(0, 2).toUpperCase() : displayName.charAt(0).toUpperCase();

	return (
		<Box sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
			<Typography
				variant='h4'
				fontWeight='bold'
				gutterBottom
			>
				Profile Settings
			</Typography>

			<Stack spacing={3}>
				{error && (
					<Alert
						severity='error'
						onClose={() => dispatch(clearError())}
					>
						{error}
					</Alert>
				)}

				{/* Profile Card */}
				<Card>
					<CardContent>
						<Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 3 }}>
							<Avatar
								sx={{
									width: 80,
									height: 80,
									bgcolor: "primary.main",
									fontSize: "2rem",
									fontWeight: "bold",
								}}
							>
								{userInitials}
							</Avatar>

							<Box sx={{ flexGrow: 1 }}>
								<Typography
									variant='h5'
									fontWeight='bold'
									gutterBottom
								>
									{displayName}
								</Typography>
								<Chip
									label={`via ${
										userProfile.provider.charAt(0).toUpperCase() + userProfile.provider.slice(1)
									}`}
									size='small'
									color='primary'
									variant='outlined'
								/>
							</Box>
						</Box>

						<Divider sx={{ mb: 3 }} />

						{/* In-Game Name Section */}
						<Typography
							variant='h6'
							fontWeight='medium'
							gutterBottom
						>
							In-Game Name
						</Typography>

						{isEditing ? (
							<Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
								<TextField
									value={newIgn}
									onChange={handleIgnChange}
									label='In-Game Name'
									variant='outlined'
									size='small'
									sx={{ flexGrow: 1 }}
									inputProps={{ maxLength: 20 }}
									helperText='2-20 characters, letters, numbers, underscore, and dash allowed'
								/>
								<Button
									variant='contained'
									startIcon={<SaveIcon />}
									onClick={handleSave}
									disabled={isLoading || !newIgn.trim() || newIgn.trim().length < 2}
									size='small'
								>
									Save
								</Button>
								<Button
									variant='outlined'
									startIcon={<CancelIcon />}
									onClick={handleCancel}
									disabled={isLoading}
									size='small'
								>
									Cancel
								</Button>
							</Box>
						) : (
							<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
								<Typography
									variant='body1'
									sx={{ py: 1 }}
								>
									{userProfile.ign}
								</Typography>
								<Button
									variant='outlined'
									startIcon={<EditIcon />}
									onClick={handleEdit}
									size='small'
								>
									Edit
								</Button>
							</Box>
						)}
					</CardContent>
				</Card>

				{/* Account Information */}
				<Card>
					<CardContent>
						<Typography
							variant='h6'
							fontWeight='medium'
							gutterBottom
						>
							Account Information
						</Typography>

						<Stack spacing={2}>
							<Box>
								<Typography
									variant='body2'
									color='text.secondary'
								>
									Email Address
								</Typography>
								<Typography variant='body1'>{session.user.email}</Typography>
							</Box>

							<Box>
								<Typography
									variant='body2'
									color='text.secondary'
								>
									Account Provider
								</Typography>
								<Typography variant='body1'>
									{userProfile.provider.charAt(0).toUpperCase() + userProfile.provider.slice(1)}
								</Typography>
							</Box>

							<Box>
								<Typography
									variant='body2'
									color='text.secondary'
								>
									Member Since
								</Typography>
								<Typography variant='body1'>
									{new Date(userProfile.createdAt).toLocaleDateString()}
								</Typography>
							</Box>
						</Stack>
					</CardContent>
				</Card>

				{/* Privacy Notice */}
				<Paper 
					sx={{ 
						p: 2, 
						bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
						border: "1px solid", 
						borderColor: (theme) => theme.palette.mode === 'dark' ? 'grey.700' : 'grey.200'
					}}
				>
					<Typography
						variant='body2'
						fontWeight='medium'
						gutterBottom
					>
						🔒 Privacy & Data
					</Typography>
					<Typography
						variant='caption'
						color='text.secondary'
					>
						• Your email address is never shared with other players
						<br />
						• Only your in-game name is visible during matches
						<br />
						• We don't store or display your OAuth provider's profile photo
						<br />
						• Your in-game name must be unique across all players
					</Typography>
				</Paper>
			</Stack>
		</Box>
	);
}

export default function ProfilePage() {
	return (
		<AuthGuard>
			<ProfileGuard>
				<ProfilePageContent />
			</ProfileGuard>
		</AuthGuard>
	);
}