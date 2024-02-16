import Image from "next/image";
import { format } from "date-fns"
import Header from "../_components/header";
import { ptBR } from "date-fns/locale";
import Search from './_components/search';
import BookingItem from "../_components/booking-item";
import { db } from "../_lib/prisma"
import BarbershopItem from "./_components/barbershop-item";
import { Key } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function Home() {

const barbershop = await db.barbershop.findMany({})

const session = await getServerSession(authOptions)

const [barbershops, confirmedBookings] =  await Promise.all([
  db.barbershop.findMany({}),
  session?.user ? db.booking.findMany({
    where: {
      userId: (session.user as any).id,
      date: {
        gte: new Date()
      }
    },
    include: {
      service:true,
      barbershop:true
    }
  }) : Promise.resolve([])
])

const bookings = session?.user ? await db.booking.findMany({
  where: {
    userId: (session.user as any).id,
  },
  include: {
    service:true,
    barbershop:true
  }
}) : []

  return (
    <div>
      <Header />
      <div className="px-5 pt-5">
        <h2 className="text-xl font-bold">Olá, {session?.user ? `Olá, ${session.user.name?.split(' ')[0]}` : "vamos agendar um corte hoje?"}</h2>
        <p className="capitalize text-sm"> 
          {format(new Date(),"EEEE ',' dd 'de' MMMM",{
          locale : ptBR,
        })}
        </p>
      </div>

      <div className="px-5 mt-6">
        <Search />
      </div>

       <div className="mt-6">
       {confirmedBookings.length > 0 && (
        <>
         <h2 className="pl-5 text-xs text-gray-400 font-bold mb-3">AGENDAMENTOS</h2>
       <div className="px-5 mt-6 flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
        {bookings.map((booking: { id: Key | null | undefined; }) => <BookingItem key={booking.id} booking={booking} />) }
       </div>
       </>
       )}
        
      </div> 

      <div className="mt-6" >
        <p className="px-5 text-xs text-gray-400 font-bold mb-3">RECOMENDADOS</p>

        <div className="flex px-5 gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {barbershop.map((barbershop: { id: Key | null | undefined; })=>(
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>
      </div>

      <div className="mt-6  mb-[4.5rem]" >
        <p className="px-5 text-xs text-gray-400 font-bold mb-3">POPULARES</p>

        <div className="flex px-5 gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {barbershop.map((barbershop: { id: Key | null | undefined; })=>(
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>
      </div>
    </div>
  );
}
