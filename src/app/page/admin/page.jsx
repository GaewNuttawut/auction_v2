'use client';

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FaUsers, FaTachometerAlt, FaEye, FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation"; // ✅ ใช้ next/navigation
import { useSession } from "next-auth/react"; // ✅ ใช้ next-auth แทน cookies

const API_URL = "http://localhost:3111/api/v1";

export default function AdminDashboard() {
  const [view, setView] = useState("dashboard");
  const [auctions, setAuctions] = useState([]);
  const [users, setUsers] = useState([]);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAuctionId, setSelectedAuctionId] = useState(null);


  const handleLogout = () => {
    // Add logout logic here
    router.push('/')
  }

  // ฟังก์ชันสำหรับดึงข้อมูล
  const fetchAuctions = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/auctions`);
      setAuctions(response.data.auctions || []);
    } catch (error) {
      console.error("Error fetching auctions:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/users`);
      setUsers(response.data.users || []); // Corrected to use response.data.users
    } catch (error) {
      console.error("Error fetching users:", error); // Updated error message for clarity
    }
  };

  // ใช้ useEffect เพื่อเรียกฟังก์ชันดึงข้อมูล
  useEffect(() => {
    fetchAuctions();
  }, []);

  // ใช้ useEffect เพื่อเรียกฟังก์ชันดึงข้อมูล
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    setSelectedAuctionId(id);
    setIsModalOpen(true); // เปิดโมดัล
  };

  const confirmDelete = async () => {
    try {
      if (!selectedAuctionId) {
        console.error("Error: selectedAuctionId is null or undefined");
        alert("❌ ไม่สามารถลบสินค้าได้: ID ไม่ถูกต้อง");
        return;
      }
  
      const url = `${API_URL}/admin/auctions/${selectedAuctionId}`;
      console.log("Deleting auction with ID:", selectedAuctionId);
      console.log("URL:", url);
  
      const response = await fetch(url, {
        method: "DELETE",
      });
  
      console.log("Response status:", response.status);
  
      if (!response.ok) {
        throw new Error(`Failed to delete. Status: ${response.status}`);
      }
  
      // ลบข้อมูลออกจาก state
      setAuctions(auctions.filter((auction) => auction._id !== selectedAuctionId));
      alert("✅ ลบสินค้าสำเร็จ");
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("❌ ไม่สามารถลบสินค้าได้");
    } finally {
      setIsModalOpen(false); // ปิดโมดัล
      setSelectedAuctionId(null);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">คุณต้องการลบสินค้านี้หรือไม่?</h2>
            <div className="flex justify-end gap-4">
              <Button
                className="bg-gray-300 text-black px-4 py-2 rounded-lg"
                onClick={() => setIsModalOpen(false)}
              >
                ยกเลิก
              </Button>
              <Button
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
                onClick={confirmDelete}
              >
                ลบ
              </Button>
            </div>
          </div>
        </div>
      )}
      <header className="bg-yellow-400 text-black p-4 text-2xl font-bold shadow-md flex justify-between items-center">
        <span>Admin Dashboard</span>
        <Button
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          onClick={handleLogout}
        >
          Log Out
        </Button>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-1/4 bg-white p-4 border-r shadow-lg">
          <nav className="space-y-4">
            <Button
              className={`w-full flex items-center gap-2 p-6 rounded-lg text-xl ${
                view === "dashboard" ? "bg-yellow-100 text-yellow-600" : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setView("dashboard")}
            >
              <FaTachometerAlt />
              Dashboard
            </Button>
            <Button
              className={`w-full flex items-center gap-2 p-6 rounded-lg text-xl ${
                view === "users" ? "bg-yellow-100 text-yellow-600" : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setView("users")}
            >
              <FaUsers />
              Users
            </Button>
          </nav>
        </aside>

        {/* Content */}
        <main className="w-3/4 p-6">
        {view === "dashboard" && (
          <Card className="shadow-lg">
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-4">Auction Overview</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Creator</TableHead>
                    <TableHead>Winner</TableHead>
                    <TableHead>Actions Status</TableHead>
                    <TableHead>Shipped</TableHead>
                    <TableHead>Edit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auctions.length > 0 ? (
                    auctions.map((auction, index) => (
                      <TableRow key={auction._id || index}>
                        <TableCell>{auction.name || "N/A"}</TableCell>
                        <TableCell>{auction.seller?.name || "N/A"}</TableCell>
                        <TableCell>{auction.highestBidderName || "N/A"}</TableCell>
                        <TableCell>
                          <Badge variant={auction.status === "Paid" ? "success" : "destructive"}>
                            {auction.status || "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {auction.shipped ? (
                            <Badge variant="success">Yes</Badge>
                          ) : (
                            <Badge variant="destructive">No</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            className="flex items-center gap-2"
                            onClick={() => {
                              if (auction.status === "Active") {
                                alert("❌ ไม่สามารถลบได้: การประมูลยังคงอยู่ในสถานะ Active");
                                return;
                              }
                              handleDelete(auction._id);
                            }}
                          >
                            <FaTrash />
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {view === "users" && (
          <Card className="shadow-lg">
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-4">User Management</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    {/* <TableHead>Address</TableHead> */}
                    <TableHead>RegisteredAt</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length > 0 ? (
                    users.map((user, index) => (
                      <TableRow key={user._id || index}>
                        <TableCell>{user.name || "N/A"}</TableCell>
                        <TableCell>{user.email || "N/A"}</TableCell>
                        <TableCell>{user.phone || "N/A"}</TableCell>
                        {/* <TableCell>{user.address || "N/A"}</TableCell> */}
                        <TableCell>{user.registeredAt || "N/A"}</TableCell>
                        <TableCell>{user.status || "N/A"}</TableCell>
                        <TableCell>
                          {/* <Button
                            variant="outline"
                            className="flex items-center gap-2"
                            onClick={() =>
                              alert(
                                `Auctions created by ${user.name}: ${user.auctionsCreated?.join(", ") || "None"}`
                              )
                            }
                          >
                            <FaEye />
                            View Auctions
                          </Button> */}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No users available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
        </main>
      </div>
    </div>
  );
}