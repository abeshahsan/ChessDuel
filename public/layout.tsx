"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import CustomModal from "@/app/new-match/page";

const Layout = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return <>{children}</>;
};

export default Layout;
