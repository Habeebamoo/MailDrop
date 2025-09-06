import { FiEdit, FiLink, FiMail, FiUsers } from "react-icons/fi"
import History from "../dashboard/History"
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import { BiRedo, BiUndo } from "react-icons/bi";

const Main = () => {
  const activities = [
    { type: "lead", name: "A lead unsubscribe from 'Summer Sale 2025' campaign", createdAt: "25 mins ago" },
    { type: "email", name: "Emails sent to 'Summer Sale 2025' subscribers", createdAt: "3 hours ago" },
    { type: "lead", name: "'Summer Sale 2025' campaign has a new subscriber", createdAt: "4 hours ago" },
  ];

  const editor = useEditor({
    extensions: [
      StarterKit, 
      Link.configure({
        openOnClick: false
      })
    ],
    content: "<p><strong>Black Friday Sales</strong></p><br><p><small>We will be hosting our first ever black friday sales on the 5th of December....</small></p>",
    editable: false,
  })

  return (
    <section className="py-6 px-3 bg-accentXLight border-t-1 border-t-accentLight">
      <div className="flex-center">
        <p className="bg-bg2 font-outfit py-1 px-2 rounded font-open text-sm text-primary">
        <span className="ml-1">Features</span>
        </p>
      </div>
      <p className="text-sm text-center mt-1 mx-auto text-accent w-[80%]">Everything you need to market through emails is provided by the platform</p>
      <div className="grid md:grid-cols-2 md:gap-3 mt-5 p-2 max-md:w-[100%] md:w-[95%] mx-auto">
        <div className="bg-white border-2 border-bg2 rounded-lg p-6 max-sm:mb-4" data-aos="fade-up">
        <h1 className="font-open mt-1 text-xl">Email Composing Template</h1>
        <p className="text-accent text-[12px] mt-1">Easily compose and format your email messages with our built in text editor, giving you the abilty to express yourself when sending marketing emaail</p>
        <div className="flex-end pl-10 mt-8">
          <div className="p-4 border-bg2 border-1 rounded-lg w-full mx-auto bg-white font-open text-sm">
            <div className="flex flex-end gap-2 border-b-accent pb-2 mb-2">
              <button 
                onClick={() => editor.chain().focus().toggleBold().run()}
                className="px-3 py-1 rounded text-sm cursor-pointer bg-primary text-white"
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
                className="px-3 py-1 rounded cursor-pointer bg-gray-100"
              >
                <FiLink size={19} />
              </button>
            </div>
            <EditorContent disabled editor={editor} className="prose max-w-none p-2 border-accent rounded"  />
          </div>
        </div>
        </div>       
        <div className="bg-white border-2 border-bg2 rounded-lg p-6" data-aos="fade-up">
          <h1 className="font-open mt-1 text-xl">Real Time Notifications</h1>
          <p className="text-accent text-[12px] mt-1">Receive notifications emails about activities going on with your leads. You can also view a short summary in your dashboard</p>
          <div className="flex-end pl-10">
            <History title="Recent Activities" backupText="" history={activities} />
          </div>
        </div>
      </div>
      <div className="flex-center mt-8">
        <p className="bg-bg2 font-outfit py-1 px-2 rounded font-open text-sm text-primary">
        <span className="ml-1">Platform Tools</span>
        </p>
      </div>
      <p className="text-sm text-center mt-1 mx-auto text-accent w-[80%]">We've gotten everything prepared down for you</p>
      <div className="grid lg:grid-cols-4 md:grid-cols-2 lg:gap-3 md:gap-3 mt-5 p-2 w-[95%] lg:w-[95%] mx-auto">
        <div className="bg-white p-7 rounded-md mb-4 border-1 border-bg2" data-aos="zoom-in">
          <div className="bg-primary p-2 rounded-md inline-block">
            <FiEdit color="white" size={25} />
          </div>
          <h1 className="font-open mt-1 text-xl">Campaign Builder</h1>
          <p className="text-accent text-sm mt-1">Create personalized campaigns with ease, add descriptions, upload lead magnets and get a sharable link instantly</p>
        </div>
        <div className="bg-white p-7 rounded-md mb-4 border-1 border-bg2" data-aos="zoom-in">
          <div className="bg-primary p-2 rounded-md inline-block">
            <FiUsers color="white" size={25} />
          </div>
          <h1 className="font-open mt-1 text-xl">Leads Organization</h1>
          <p className="text-accent text-sm mt-1">Collect, view and manage all your leads, sort by any category and export data for later use</p>
        </div>
        <div className="bg-white p-7 rounded-md mb-4 border-1 border-bg2" data-aos="zoom-in">
          <div className="bg-primary p-2 rounded-md inline-block">
            <FiLink color="white" size={25} />
          </div>
          <h1 className="font-open mt-1 text-xl">Unique Sharable Links</h1>
          <p className="text-accent text-sm mt-1">Generate campaigns-specific links to share across social media, emails or websites.</p>
        </div>
        <div className="bg-white p-7 rounded-md mb-4 border-1 border-bg2" data-aos="zoom-in">
          <div className="bg-primary p-2 rounded-md inline-block">
            <FiMail color="white" size={25} />
          </div>
          <h1 className="font-open mt-1 text-xl">Email Marketing</h1>
          <p className="text-accent text-sm mt-1">Send targeted promotional or follow-up emails to your leads directly from your dashboard</p>
        </div>
      </div>
    </section>
  )
}

export default Main