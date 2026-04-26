"use client";

import { Plus, Loader2, Tag, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import { useAdminStore } from "@/store/adminStore";

export default function OfferManagement() {
    const { adminOffers, isLoading } = useAdminStore();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Offer Management</h1>
                    <p className="text-slate-500">Manage promotional pricing and seasonal discounts.</p>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2">
                    <Plus className="h-4 w-4" />
                    New Offer
                </Button>
            </div>

            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle>Active Offers</CardTitle>
                    <CardDescription>A list of current promotional discounts across the platform.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">#</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Live Price</TableHead>
                                    <TableHead>From Date</TableHead>
                                    <TableHead>To Date</TableHead>
                                    <TableHead>Message</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {adminOffers.map((offer, index) => (
                                    <TableRow key={offer.id}>
                                        <TableCell className="font-medium text-slate-400">{index + 1}</TableCell>
                                        <TableCell className="text-slate-500 line-through">₹{offer.price}</TableCell>
                                        <TableCell className="font-bold text-emerald-600">₹{offer.live_price}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <Calendar className="h-3 w-3" />
                                                {offer.from_date}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <Calendar className="h-3 w-3" />
                                                {offer.to_date}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium inline-block">
                                                {offer.message}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" className="text-indigo-600 font-bold">Edit</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {adminOffers.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-12 text-slate-500">
                                            No active offers found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
