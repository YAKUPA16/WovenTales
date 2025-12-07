import { useState, useEffect } from "react";
import "./BlogEditor.css";
import { getProfile } from "../../services/userService";
import { createBlog } from "../../services/blogService";
import { FiArrowLeft } from "react-icons/fi";


const BlogEditor = ({ onSubmit, onBack }) => {
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [content, setContent] = useState("");
  const [user, setUser] = useState(null);

  // fetch user function to run once when rendered
  useEffect(() => {
    const fetchUser = async () => {
      try 
      {
        // gets the logged in user's username etc
        const data = await getProfile();
        setUser(data);
      } 
      catch (err) 
      {
        console.error("Error fetching profile:", err);
      }
    };
    fetchUser();
  }, []);

  // adding the new tags and checking if previous version doesnt exist
  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) 
    {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  // if tag crossed then remove that specific tag using filter
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // upon submission, the page doesnt go back to the home page so prevent default
  const handleSubmit = async (e) => {
    e.preventDefault();

    // fill out required fields
    if (!title.trim() || !content.trim() || tags.length === 0) 
    {
      alert("Please fill in all required fields");
      return;
    }

    // make document to save in db
    try {
      const newBlog = {
        title,
        content,
        tags: tags.map((tag) => (tag.startsWith("#") ? tag : `#${tag}`)),
        image: imageUrl,
      };

      const savedBlog = await createBlog(newBlog);

      alert("Blog published successfully!");

      // clear fields
      setTitle("");
      setImageUrl("");
      setTags([]);
      setTagInput("");
      setContent("");

    // if the onsubmit prop is passed then pass the savedblog to the parent component
      if (onSubmit) 
        {
          onSubmit(savedBlog);
        }
    } 
    catch (err) 
    {
      console.error("Error saving blog:", err.response || err);
    }
  };

  return (
    <div className="create-blog-wrapper">
      <button className="back-button" onClick={() => {onBack();  //passed as prop from parent, go back to parent   
          window.location.reload();}}> {/*reload the page to refresh chnages*/} 
      <FiArrowLeft />  
      </button>
      <h3 style={{fontSize:"25px", color:"white"}}>Create a New Blog</h3>

      <form className="create-blog-form" onSubmit={handleSubmit}>
        <label>
          Title *
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Blog title"
            required/>
        </label>

        <label>
          Image URL
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter image URL"/>
        </label>
        {imageUrl && <img src={imageUrl} alt="preview" className="image-preview" />}

        <label>
          Tags *
          <div className="tags-input-wrapper">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Write 1 relevant tag then enter"
              // upon enter, dont submit form but add tag so prevent default
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}/>
            <button type="button" onClick={handleAddTag}>Add Tag</button>
          </div>
          <div className="tags-preview">
            {/* iterates over each tag, has a remove button and keeps track it tags key*/}
            {tags.map((tag, idx) => (
              <span key={idx} className="tag">
                {tag} <button type="button" onClick={() => handleRemoveTag(tag)}>x</button>
              </span>))}
          </div>
        </label>

        <label>
          Content *
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your blog here..."
            required/>
        </label>

        <button type="submit" className="submit-btn">Publish Blog</button>
      </form>
    </div>
  );
};

export default BlogEditor;
