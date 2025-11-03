import { BiArrowBack, BiTrash } from "react-icons/bi"
import { FaArrowRightFromBracket } from "react-icons/fa6"
import { CgMail } from "react-icons/cg"
import { FiLink, FiUsers } from "react-icons/fi"
import { FaRegHandPointer } from "react-icons/fa"
import Pagination from "./Pagination"
import { useEffect, useState } from "react"
import Loading from "../Loading"
import { useCampaignId } from "../../../context/CampaignContext"
import { GoHistory } from "react-icons/go"
import Error from "../Error"
import { toast } from "react-toastify"
import Warning from "../Warning"
import {  HiArrowLeftStartOnRectangle } from "react-icons/hi2"
import Spinner from "../Spinner"

const Campaign = ({ setActiveTab }: { setActiveTab: React.Dispatch<React.SetStateAction<"campaigns" | "new" | "leads">>
}) => {
  const [campaign, setCampaign] = useState<any>()
  const [loading, setLoading] = useState<boolean>(true)
  const [uploading, setUploading] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [leads, setLeads] = useState<any[]>([])
  const [warning, setWarning] = useState<boolean>(false)
  const [file, setFile] = useState<File | null>(null)
  const { campaignId } = useCampaignId()

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await fetch(`https://maildrop-znoo.onrender.com/api/campaign/${campaignId}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": import.meta.env.VITE_X_API_KEY
          }
        })
        const response = await res.json()

        if (res.ok) {
          setCampaign(response)
        } else {
          setError(true)
        }

      } catch (err) {
        console.log("something went wrong")
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchCampaign()
  }, [])

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const res = await fetch(`https://maildrop-znoo.onrender.com/api/campaign/${campaignId}/subscribers`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": import.meta.env.VITE_X_API_KEY
          }
        }) 
        const response = await res.json()

        if (res.ok) {
          setLeads(response)
        }
      } catch (err) {
        console.log(err)
      }
    }

    fetchSubscribers()
  }, [])

  const deleteCampaign = async () => {
    setWarning(false)
    setLoading(true)

    try {
      const res = await fetch(`https://maildrop-znoo.onrender.com/api/campaign/${campaign.campaignId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": import.meta.env.VITE_X_API_KEY
        }
      })
      const response = await res.json()

      if (res.ok) {
        toast.success(response.message)
        setTimeout(() => window.location.href = "/dashboard/campaigns", 2500)
      } else {
        toast.error(response.error)
      }
    } catch (err) {
      toast.error("something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async () => {
    if (!file) return 
    setUploading(true)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch(`https://maildrop-znoo.onrender.com/api/campaign/${campaign.campaignId}/importcsv`, {
        method: "POST",
        credentials: "include",
        headers: {
          "X-API-KEY": import.meta.env.VITE_X_API_KEY
        },
        body: formData
      })
      const response = await res.json()

      if (res.ok) {
        toast.success(response.message)
        setTimeout(() => window.location.href = "/dashboard/campaigns", 2500)
      } else {
        toast.error(response.error)
      }
    } catch {
      toast.error("something went wrong")
    } finally {
      setUploading(false)
    }
  }

  const goBack = () => {
    setActiveTab("campaigns")
  }

  const copySlug = () => {
    navigator.clipboard.writeText(campaign.slug).then(() => {
      toast.success("Campaign url copied to clipboard")
    })
  }

  const getBriefOf = (str: string) => {
    const maxLength = 120;
    return str.length > maxLength ? str.slice(0, maxLength) + "..." : str
  }

  const exportSubscribers = async () => {
    try {
      const res = await fetch(`https://maildrop-znoo.onrender.com/api/campaign/${campaignId}/subscribers/download`, {
        method: "GET",
        credentials: "include",
        headers: {
          "X-API-KEY": import.meta.env.VITE_X_API_KEY
        }
      })

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a")
        a.href = url

        let fileName = "subscribers.csv"

        const dispostion = res.headers.get("Content-Disposition")
        if (dispostion && dispostion.includes("filename=")) {
          fileName = dispostion.split("filename=")[1].replace(/['"']/g, "");
        }

        a.download = fileName
        document.body.appendChild(a)
        a.click()
        a.remove()

        window.URL.revokeObjectURL(url)
      } else {
        toast.error("Something went wrong.")
      }
    } catch (err) {
      toast.error("Something went wrong.")
    }
  }

  if (loading) return <Loading />

  return (
    <section className="md:ml-[170px] mt-[57px] px-3 pt-2 pb-25 min-h-[calc(100vh-4rem)]">
      {error && <Error title="Unknown Error" text="Failed to get camapign" path="/dashboard/campaigns" pathText="Go Back" /> }
      {warning && 
        <Warning 
          title="Warning" 
          text={`Are you sure you want to delete "${campaign.title}" campaign`} 
          setWarning={setWarning}
          confirmAction={deleteCampaign}
        />
      }
      <div className="flex-between mt-4">
        <h1 className="text-xl text-primary font-inter dark:text-white">{campaign.title}</h1>
          <button onClick={goBack} className="px-3 flex-center gap-1 btn-primary">
            <BiArrowBack />
            <span>Back</span>
          </button>
      </div>
      <p className="text-sm text-accent mb-4 max-md:mt-2">{getBriefOf(campaign.description)}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white dark:bg-gray-900 border-1 border-bg2 dark:border-gray-800 p-4 rounded-xl flex-start gap-4">
          <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg">
            <FiUsers size={20} color="#2f299cff" />
          </div>
          <div>
            <p className="font-outfit text-sm text-accent">Subscribers</p>
            <h1 className="font-inter text-xl mt-2 dark:text-white">{campaign.totalSubscribers}</h1>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border-1 border-bg2 dark:border-gray-800 p-4 rounded-xl flex-start gap-4">
          <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg">
            <FaRegHandPointer size={20} color="#2f299cff" />
          </div>
          <div>
            <p className="font-outfit text-sm text-accent">Clicks</p>
            <h1 className="font-inter text-xl mt-2 dark:text-white">{campaign.totalClicks}</h1>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border-1 border-bg2 dark:border-gray-800 p-4 rounded-xl flex-start gap-4">
          <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg">
            <CgMail size={20} color="#2f299cff" />
          </div>
          <div>
            <p className="font-outfit text-sm text-accent">Emails Sent</p>
            <h1 className="font-inter text-xl mt-2 dark:text-white">{campaign.totalEmails}</h1>
          </div>
        </div>
      </div>

      <div className="flex-between mt-8">
        <h1 className="text-xl text-primary font-inter dark:text-white">Subscribers</h1>
        <button onClick={exportSubscribers} className="px-3 flex-center gap-2 text-[12px] btn-primary">
          <span>Export</span>
          <FaArrowRightFromBracket />
        </button>
      </div>
      <p className="text-sm font-open text-accent mb-4">Manage and track your leads</p>

      {leads ? (
        <Pagination data={leads} />
      ) : (
        <div className="p-6 rounded-md bg-white dark:bg-gray-900 dark:border-1 dark:border-gray-800 mt-4">
          <div className="p-14 mt-2 flex-center flex-col gap-4">
            <GoHistory size={50} color="rgb(121, 120, 120)" />
            <p className="text-accent text-sm">Your Subscribers would appear here</p>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 border-1 border-bg2 dark:border-gray-800 p-4 rounded-xl mt-8">
        <h1 className="text-primary dark:text-white font-inter text-lg">Import CSV File</h1>
        <p className="font-open text-sm text-accent mb-4 mt-1">Add a CSV file containing other fields including emails</p>

        <div className="bg-gray-200 rounded-full p-1 overflow-hidden w-[100%] sm:w-[400px]">
          <input 
            type="file" 
            accept=".csv"
            className="file:bg-primary file:text-white file:py-1 file:px-4 text-[12px] file:rounded-full file:cursor-pointer" 
            onChange={e => setFile(e.target.files![0])}
          />
        </div>

        {uploading ? 
          <button className="px-3 mt-4 py-3 bg-gray-400 border-gray-400 hover:bg-gray-400 hover:text-white btn-primary text-sm max-sm:w-full flex-center">
            <Spinner size={16} />
          </button>
        : 
          <button onClick={handleUpload} className="px-3 py-2 flex-center gap-2 text-sm btn-primary mt-4 max-sm:w-full">
            <span>Import CSV</span>
            <HiArrowLeftStartOnRectangle />
          </button>
        }
      </div>

      <div className="mt-6 px-1">
        <button
          onClick={copySlug}
          className="flex-start gap-2 p-2 rounded-md border-1 border-primary text-white bg-primary hover:bg-transparent hover:text-primary cursor-pointer"
        >
          <FiLink size={20} />
          <span className="font-outfit">Share Campaign</span>
        </button>
        <button 
          onClick={() => setWarning(true)}
          className="flex-start gap-2 p-2 rounded-md mt-4 border-1 border-red-500 text-white bg-red-500 hover:bg-transparent hover:text-red-500 cursor-pointer"
        >
          <BiTrash size={20} />
          <span className="font-outfit">Delete Campaign</span>
        </button>
      </div>
    </section>
  )
}

export default Campaign