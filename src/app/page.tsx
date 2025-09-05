import BookingRevenueTrend from "@/components/Home/BookingRevenueTrend";
import Cards from "@/components/Home/Cards";
import FlaggedHiddenServices from "@/components/Home/FlaggedHiddenServices";
import RecentTransactionsReport from "@/components/Home/RecentTransactionsReport";
import UserSignupsOverTime from "@/components/Reports/UserReports/UserSignupsOverTime";
import Image from "next/image";

export default function Home() {
  return (
    <div className="max-w-[1200px] mx-auto w-full">
      <h2 className="text-black text-[22px] sm:text-[34px] font-normal leading-[26px] sm:leading-[38px] tracking-[0.5px]">
        Welcome, Angela Wambui! 👋
      </h2>
      <p className="text-[#676D75] text-[16px] leading-[32px] font-normal mt-2 mb-3.5">Here's what's happening:</p>
      <Cards />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3.5 mt-3.5">
        <UserSignupsOverTime />
        <BookingRevenueTrend />
      </div>
      <div className="flex lg:flex-row flex-col gap-3.5 my-3.5">
        <FlaggedHiddenServices />
        <div className="w-full max-w-[430px] relative">
          <img
            src="/assets/nice.svg"
            alt="nice"
            // fill
            className="object-contain rounded-md"
          />
        </div>
      </div>
      <RecentTransactionsReport />
    </div>
  );
}