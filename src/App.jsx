import { useState, useCallback } from 'react'
import Login from './components/Login'
import Onboarding from './components/Onboarding'
import HomeTab from './components/tabs/HomeTab'
import JournalTab from './components/tabs/JournalTab'
import InsightsTab from './components/tabs/InsightsTab'
import ProfileTab from './components/tabs/ProfileTab'
import CalmTab from './components/tabs/CalmTab'
import BottomNav from './components/BottomNav'
import BreathingModal from './components/modals/BreathingModal'
import ChatModal from './components/modals/ChatModal'
import CrisisModal from './components/modals/CrisisModal'
import PrivacyModal from './components/modals/PrivacyModal'
import CounselorDashboard from './components/CounselorDashboard'
import Toast from './components/Toast'

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [sessionToken, setSessionToken] = useState('local-session')
  const [studentData, setStudentData] = useState(null)
  const [userRole, setUserRole] = useState('student') // 'student' | 'counselor'
  const [onboarded, setOnboarded] = useState(false)
  const [language, setLanguage] = useState('en')
  const [activeTab, setActiveTab] = useState('home')
  const [openModal, setOpenModal] = useState(null)
  const [toast, setToast] = useState({ msg: '', show: false })
  const [entries, setEntries] = useState([]) // Now starts empty!

  const showToast = useCallback((msg) => {
    setToast({ msg, show: true })
    setTimeout(() => setToast(t => ({ ...t, show: false })), 2400)
  }, [])

  const addEntry = useCallback((entry) => {
    setEntries(prev => [entry, ...prev])
  }, [])

  const handleLogin = (token, student) => {
    if (token === 'counselor') {
      setUserRole('counselor')
    } else {
      setUserRole('student')
      setSessionToken(token)
      setStudentData(student)
    }
    setLoggedIn(true)
  }

  const handleFinishOnboarding = (selectedLang) => {
    setLanguage(selectedLang)
    setOnboarded(true)
  }

  if (!loggedIn) {
    return <Login onLogin={handleLogin} />
  }

  if (userRole === 'counselor') {
    return (
      <div className="counselor-root-override">
        <CounselorDashboard onLogout={() => { setLoggedIn(false); setUserRole('student') }} />
      </div>
    )
  }

  if (!onboarded) {
    return <Onboarding onFinish={handleFinishOnboarding} />
  }

  return (
    <>
      <div className="bg-blobs">
        <div className="blob blob1" />
        <div className="blob blob2" />
        <div className="blob blob3" />
      </div>

      <BottomNav activeTab={activeTab} onSwitch={setActiveTab} />

      <div className="app-scroll">
        {activeTab === 'home' && (
          <HomeTab
            latestEntry={entries[0]}
            onOpenModal={setOpenModal}
            onSwitchTab={setActiveTab}
            showToast={showToast}
          />
        )}
        {activeTab === 'journal' && (
          <JournalTab
            sessionToken={sessionToken}
            entries={entries}
            addEntry={addEntry}
            showToast={showToast}
          />
        )}
        {activeTab === 'calm' && <CalmTab />}
        {activeTab === 'insights' && <InsightsTab entries={entries} />}
        {activeTab === 'profile' && (
          <ProfileTab 
            studentData={studentData}
            entries={entries}
            onOpenModal={setOpenModal} 
            onLogout={() => { setLoggedIn(false); setEntries([]); setSessionToken(null); }}
          />
        )}
      </div>

      <BreathingModal open={openModal === 'breath'} onClose={() => setOpenModal(null)} showToast={showToast} />
      <ChatModal open={openModal === 'chat'} onClose={() => setOpenModal(null)} />
      <CrisisModal open={openModal === 'crisis'} onClose={() => setOpenModal(null)} />
      <PrivacyModal open={openModal === 'privacy'} onClose={() => setOpenModal(null)} />

      <Toast message={toast.msg} show={toast.show} />
    </>
  )
}
