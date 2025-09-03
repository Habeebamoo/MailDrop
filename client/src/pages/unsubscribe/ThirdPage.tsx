import { BiHeart } from "react-icons/bi"
import { IoMdCheckmarkCircleOutline } from "react-icons/io"
import { MdOutlineShield } from "react-icons/md"
import { SlArrowRight } from "react-icons/sl"

const ThirdPage = ({ responseData }: { responseData: any }) => {
  return (
    <>
      <div className="bg-white p-8 rounded-sm w-[95%] sm:w-[500px] mx-auto mt-10">
        <div className="flex-center h-11 w-11 bg-green-500 rounded-full mx-auto">
          <IoMdCheckmarkCircleOutline color="#fff" size={25} />
        </div>
        <h1 className="font-inter text-2xl mt-2 text-center">You've Unsubscribed</h1>
        <p className="text-[10px] text-accent mt-2 text-center">
          We've successfully removed <span className="text-primary font-bold">{responseData.subscriberEmail}</span> from our email lists.
        </p>
        <div className="p-3 bg-accentXLight mt-4 rounded-md text-center">
          <h1 className="font-outfit">Unsubscribe Details</h1>
          <div className="text-sm mt-4 font-outfit">
            <p className="text-accent">Email Address</p>
            <p>{responseData.subscriberEmail}</p>
          </div>
          <div className="text-sm mt-4 font-outfit">
            <p className="text-accent">Unsubscribed From</p>
            <p>{responseData.campaignTitle}</p>
          </div>
          <div className="text-sm mt-4 mb-2 font-outfit">
            <p className="text-accent">Status</p>
            <span className="py-1 px-3 mt-3 text-[10px] text-green-100 bg-green-500 rounded-full">Confirmed</span>
          </div>
        </div>
        <div className="mt-4">
          <h1 className="font-inter text-center">What happens next?</h1>
          <div className="mx-auto text-center mt-4">
            <div className="h-9 w-9 rounded-full flex-center bg-purple-200 mx-auto">
              <MdOutlineShield size={20} color="purple" />
            </div>
            <p className="text-sm mt-1">Immediate Effects</p>
            <p className="text-[12px] text-accent">No more emails from this campaign</p>
          </div>
          <div className="mx-auto text-center mt-4">
            <div className="h-9 w-9 rounded-full flex-center bg-green-300 mx-auto">
              <BiHeart size={20} color="green" />
            </div>
            <p className="text-sm mt-1">Always Welcome</p>
            <p className="text-[12px] text-accent">You can re-subscribe anytime</p>
          </div>
        </div>
        <div className="mt-8 max-sm:grid max-sm:grid-cols-1 sm:flex-center gap-4">
          <button
            className="btn-primary flex-center gap-2 cursor-pointer max-sm:py-2"
          >
            <span>Visit MailDrop</span>
            <SlArrowRight size={10} />
          </button> 
          <button
            className="bg-transparent hover:bg-accentLight text-accent border-1 border-accentLight px-3 py-1 flex-center gap-2 rounded-md cursor-pointer max-sm:py-2"
          >
            <BiHeart />
            <span>Resubscribe</span>
          </button>
        </div>
      </div>
    </>
  )
}

export default ThirdPage