import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import { FiLink } from "react-icons/fi"
import { BiRedo, BiUndo } from "react-icons/bi"
import { BsArrowLeft } from "react-icons/bs"
import { useEffect, useState } from "react"
import { IoIosSend } from "react-icons/io"
import { FaUser } from "react-icons/fa"
import { toast } from "react-toastify"
import Loading from "../Loading"
import { useUser } from "../../../context/UserContext"
import Error from "../Error"
import { useNavigate } from "react-router-dom"
import Spinner from "../Spinner"

const NewEmail = ({ setActiveTab }: { setActiveTab: React.Dispatch<React.SetStateAction<"dashboard" | "new">> }) => {
  const [step, setStep] = useState<number>(1)
  const [content, setContent] = useState<string>("");
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [campaignSelected, setCampaignSelected] = useState<string>("");
  const [loadingScreen, setLoadingScreen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [form, setForm] = useState({
    subject: "",
    senderName: "",
  })
  const { user } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    setLoadingScreen(true)

    const fetchCampaigns = async () => {
      try {
        const res = await fetch(`https://maildrop-znoo.onrender.com/api/campaign?userId=${user?.userId}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": import.meta.env.VITE_X_API_KEY
          }
        })
        const response = await res.json()

        if (res.ok) {
          setCampaigns(response)
        } else {
          return
        }
      } catch (err) {
        toast.error("Something went wrong")
      } finally {
        setLoadingScreen(false)
      }
    }

    fetchCampaigns()
  }, [])

  const sendMail = async () => {
    if (!form.subject || !campaignSelected || !content) {
      toast.error("All fields are required")
      return
    }

    setLoading(true)
    const body = { ...form, userId: user?.userId, campaignId: campaignSelected, content: content }

    try {
      const res = await fetch("https://maildrop-znoo.onrender.com/api/campaign/sendmail", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": import.meta.env.VITE_X_API_KEY
        },
        body: JSON.stringify(body)
      })
      const response = await res.json()

      if (res.ok) {
        toast.success(response.message)
        setTimeout(() => {
          navigate("/dashboard/email")
        }, 3000);
      } else {
        toast.error(response.error)
      }
    } catch (err) {
      toast.error("Something went wrong.")
    } finally {
      setLoading(false)
    } 
  }

  const toDashboard = () => {
    setActiveTab("dashboard")
  }

  const editor = useEditor({
    extensions: [
      StarterKit, 
      Link.configure({
        openOnClick: false
      })
    ],
  })

  useEffect(() => {
    editor.on("update", () => {
      setContent(editor.getHTML())
    })

    return () => {
      editor.off("update")
    }
  }, [editor])

  const addLink = () => {
    const url = window.prompt("Enter a URL")
    if (url) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
    }
  }

  const nextStep = () => {
    if (!campaignSelected || !form.subject) {
      toast.error("Fields are required")
      return
    }
    setStep(step + 1)
  }

  if (loadingScreen) return <Loading />

  if (campaigns.length === 0) return <Error title="Unexpected Error" text="An unexpected error occured. Please try again" path="/dashboard/email" pathText="Go Back" />

  return (
    <section className="md:ml-[170px] mt-[57px] px-3 pt-2 pb-25 min-h-[calc(100vh-4rem)]">
      <div className="flex-between mt-4">
        <h1 className="text-xl text-primary font-inter dark:text-white">Compose & Send Emails</h1>
        <button onClick={toDashboard} className="px-3 flex-center gap-1 btn-primary">
          <BsArrowLeft />
          <span>Back</span>
        </button>
      </div>
      <p className="text-sm text-accent mb-4 max-md:mt-2">Create and send targetted emails to your campaign audience</p>

      {/* tab */}
      <div className="flex-between gap-4 w-[70%] sm:w-[250px] mx-auto mt-8">
        <div className="step-active">1</div>
        <div className={`${step > 1 ? "bg-primary" : "bg-gray-200"} h-1 flex-1 rounded-full`}></div>
        <div className={`${step == 2 ? "step-active" : "step"}`}>2</div>
      </div>

      {/* step 1 */}
      {step === 1 && 
        <div>
          <h1 className="text-xl text-primary font-inter mt-8 text-center dark:text-white">Email Settings</h1>
          <form className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 border-1 border-bg2 rounded-xl mt-4 mb-4">
            <div className="flex-start gap-2">
              <FaUser size={17} color="#231e88" />
              <div>
                <p className="font-inter text-lg dark:text-white">Sender Information</p>
              </div>
            </div>
            <p className="text-accent text-[12px] mb-4">Configure sender's information and delivery options</p>
            <div className="mb-4">
              <label htmlFor="campaign" className="block font-open text-sm dark:text-white">Select Campaign</label>
              <select 
                className="border-1 border-accentLight dark:border-gray-700 dark:bg-gray-800 dark:text-white p-2 mt-2 rounded w-full"
                value={campaignSelected}
                onChange={(e) => setCampaignSelected(e.target.value)}
              >
                <option value="">select campaign</option>
                {campaigns ? 
                  campaigns.map(campaign => {
                    return (
                      <option key={campaign.campaignId} value={campaign.campaignId}>{campaign.title}</option>
                    )
                  }) :
                  <option value="no">No Campaign</option>
                }
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="subject" className="block font-open text-sm dark:text-white">Email Subject</label>
              <input 
                type="text"
                className="border-1 border-accentLight dark:border-gray-700 dark:bg-gray-800 dark:text-white p-2 mt-2 rounded w-full" 
                value={form.subject}
                onChange={(e) => setForm(prev => ({...prev, subject: e.target.value}))}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="from-name" className="block font-open text-sm dark:text-white">Sender Name (Optional)</label>
              <input 
                type="text"
                className="border-1 border-accentLight dark:border-gray-700 dark:bg-gray-800 dark:text-white p-2 mt-2 rounded w-full" 
                value={form.senderName}
                onChange={(e) => setForm(prev => ({...prev, senderName: e.target.value}))}
              />
            </div>
          </form>
        </div>
      }

      {/* editor */}
      {step === 2 && 
        <div>
          <div className="mt-8 p-4 border-bg2 border-1 rounded-lg w-full mx-auto bg-white">
            <div className="flex flex-end gap-2 border-b-accent pb-2 mb-2">
              <button 
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`px-3 py-1 rounded text-sm cursor-pointer ${editor.isActive("bold") ? "bg-primary text-white" : "bg-gray-100"}`}
              >B</button>

              <button 
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`px-3 py-1 rounded text-sm cursor-pointer font-inter ${editor.isActive("italic") ? "bg-primary text-white" : "bg-gray-100"}`}
              >I</button>

              <button 
                onClick={() => editor.chain().focus().undo().run()}
                className="px-3 py-1 rounded cursor-pointer bg-gray-100"
              ><BiUndo size={19} /></button>

              <button 
                onClick={() => editor.chain().focus().redo().run()}
                className="px-3 py-1 rounded cursor-pointer bg-gray-100"
              ><BiRedo size={19} /></button>

              <button
                onClick={addLink}
                className="px-3 py-1 rounded cursor-pointer bg-gray-100"
              >
                <FiLink size={19} />
              </button>
            </div>
            <EditorContent editor={editor} className="max-w-none rounded-lg"  />
          </div>
          <div className="mt-4 mb-8">
            {!loading &&         
              <button onClick={sendMail} className="py-2 btn-primary max-sm:w-full flex-center gap-2">
                <span>Send Mail</span>
                <IoIosSend />
              </button>
            }
            {loading && 
              <button className="btn-primary bg-gray-400 border-gray-400 hover:bg-gray-400 hover:text-white py-3 max-sm:w-full flex-center">
                <Spinner size={18} />
              </button>
            }
          </div>
        </div>
      }

      {step == 1 && 
        <div className="flex-center mt-8">
          <button onClick={nextStep} className="btn-primary py-2 px-4">Next</button>
        </div>
      }
    </section>
  )
}

export default NewEmail