import {Routes,Route} from 'react-router-dom'

//pages
import AdminPage from "./pages/AdminPage"
import UserPage from './pages/UserPage'
import HomePage from './pages/HomePage'
import Login from './components/login/Login'
//admin routes
import CreateJob from './components/admin/CreateJob'
import Applications from './components/admin/Applications'
import ViewApplicants from './components/admin/ViewApplicants'
import AdminDash from './components/admin/AdminDash'
//user routes
import ApplyJobs from './components/user/ApplyJobs'
import AppliedJobs from './components/user/AppliedJobs'
import Register from './components/login/Register'
import CandidateRegister from './components/login/CandidateRegister'
import HRRegister from './components/login/HRRegister'
import AdminProfile from './components/admin/AdminProfile'
import ClossedApplications from './components/admin/ClossedApplications'
import ViewSelectedApplicants from './components/admin/ViewSelectedApplicants'
import UserDash from './components/user/UserDash'
import UserProfile from './components/user/UserProfile'
function App() {
  return (
    <>
    <Routes>
    <Route path='/' element={<HomePage/>}>
        <Route path='' element={<Login/>}/>
        <Route path='login' element={<Login/>}/>
        <Route path='register' element={<Register/>}>
            <Route path='candidate' element={<CandidateRegister/>}/>
            <Route path='hr' element={<HRRegister/>}/>
        </Route>
    </Route>
    <Route path='/hr' element={<AdminPage/>}>
        <Route path='' element={<AdminDash/>}/>
        <Route path='createjob' element={<CreateJob/>}/>
        <Route path='applications' element={<Applications/>}/>
        <Route path='applications/:jid' element={<ViewApplicants/>}/>
        <Route path='closedapplications' element={<ClossedApplications/>}/>
        <Route path='closedapplications/:jid' element={<ViewSelectedApplicants/>}/>
        <Route path='profile' element={<AdminProfile/>}/>
    </Route>
    <Route path='/candidate' element={<UserPage/>}>
        <Route path='' element={<UserDash/>}/>
        <Route path='profile' element={<UserProfile/>}/>
        <Route path='applyjobs' element={<ApplyJobs/>}/>
        <Route path='appliedjobs' element={<AppliedJobs/>}/>
    </Route>
    </Routes>
    </>
  )
}

export default App
