import { Button } from "@/app/_components/ui/button";
import { db } from "@/app/_lib/prisma";
import { ChevronLeftIcon, MapPinIcon, MenuIcon, StarIcon } from "lucide-react";
import { Covered_By_Your_Grace } from "next/font/google";
import Image from "next/image";
import BarbershopInfo from "./_components/barbershop-info";
import ServiceItem from "./_components/service-item";
import { Key } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";

interface BabershopDetailsPageProps{
    params: {
        id?: string;
    }
}

const BabershopDetailsPage = async ({params}:BabershopDetailsPageProps) => {
    const session = await getServerSession(authOptions);
    if (!params.id){
        return null;
    }

    const barbershop = await db.barbershop.findUnique({
        where:{
            id: params.id,
        },
        include:{
            services: true,
        }
    });

    if (!barbershop){
        return null;
    }
    
    return ( 
        <div>
            <BarbershopInfo barbershop={barbershop} />

            <div className="px-5 flex flex-col gap-4 py-6">
                {barbershop.services.map((service: { id: Key | null | undefined; }) => (
                    <ServiceItem isAuthenticated={!!session?.user} key={service.id} service={service} barbershop={barbershop}/>
                ))}
            </div>
        </div>
     );
}
 
export default BabershopDetailsPage;