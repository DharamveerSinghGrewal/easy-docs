import TextEditor from "./TextEditor"
import{BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

import Dashboard from "./Dashboard"
function App() {
return (
<Router>
  <Routes>
  <Route path="/"
  element={<Navigate to= "/dashboard"/>}
  />
  <Route
          path="/dashboard"
          element={<Dashboard/>}
        />
     <Route path="/documents/:id" element={<TextEditor />} />
  </Routes>
  </Router>
 ) 
}

export default App
