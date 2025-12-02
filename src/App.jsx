import "./App.css";
import Layout from "./components/layout/Layout";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import My from "./pages/My";
import Join from "./pages/Join";
import ProfileEdit from "./pages/ProfileEdit";
import ArticleWrite from "./pages/ArticleWrite";
import ArticleEdit from "./pages/ArticleEdit";
import ArticleDetail from "./pages/ArticleDetail";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/join" element={<Join />} />
        <Route path="/login" element={<Login />} />
        <Route path="/my" element={<My />} />
        <Route path="/my/change" element={<ProfileEdit />} />
        <Route path="/articles/write" element={<ArticleWrite />} />
        <Route path="/articles/:articleId/edit" element={<ArticleEdit />} />
        <Route path="/articles/:articleId" element={<ArticleDetail />} />
      </Route>
    </Routes>
  );
}

export default App;
