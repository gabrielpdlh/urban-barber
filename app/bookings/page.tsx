import { getServerSession } from "next-auth";
import Header from "../_components/header";
import { redirect } from "next/navigation";
import { db } from "../_lib/prisma";
import BookingItem from "../_components/booking-item";
import { Key } from "react";
import { isFuture, isPast } from "date-fns";
import { authOptions } from "../_lib/auth";


const BookingsPage = async () => {

    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/")
    }


    const [confirmedBookings, finishedBookings ] = await Promise.all([
        db.booking.findMany({
            where: {
                userId: (session.user as any).id,
                date:{
                    gte: new Date (),
                }
            },
            include:{
                service: true,
                barbershop: true,
            }
        }),
        db.booking.findMany({
            where: {
                userId: (session.user as any).id,
                date:{
                    lt: new Date (),
                }
            },
            include:{
                service: true,
                barbershop: true,
            }
        })
    ])

    // const confirmedBookings = bookings.filter((booking: { date: any; }) => isFuture(booking.date))
    // const finishedBookings = bookings.filter((booking: { date: any; }) => isPast(booking.date))

    return (
        <>
            <Header></Header>

            <div className="px-5 py-6">
                <h1 className="text-xl font-bold mb-6">Agendamentos</h1>

                {confirmedBookings.length > 0 && (
                    <>
                    <h2 className="text-gray-400 uppercase text-ms font-bold mb-3">Confirmados</h2>

                    <div className="flex flex-col gap-3">
                    {confirmedBookings.map((booking: { id: Key | null | undefined; }) => (
                        <BookingItem  key={booking.id} booking={booking} />
                    ))}
                </div>
                </>
                )}

                {finishedBookings.length > 0 && (
                    <>
                        <h2 className="text-gray-400 uppercase text-ms font-bold mt-6 mb-3">Finalizados</h2>

                        <div className="flex flex-col gap-3">
                            {finishedBookings.map((booking: { id: Key | null | undefined; }) => (
                                <BookingItem  key={booking.id} booking={booking} />
                            ))}
                        </div>
                    </>
                )}

                

                
            </div>

            
        </>
    );
}
 
export default BookingsPage;