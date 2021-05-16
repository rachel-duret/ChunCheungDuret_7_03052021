import React, {useEffect, useState, useContext} from 'react'
import {useParams} from 'react-router-dom';
import axios from 'axios';
import {useHistory} from 'react-router-dom';
import {AuthContext} from '../helpers/AuthContext'
import Moment from 'react-moment';
import DeleteIcon from '@material-ui/icons/Delete';





function Post() {
  let history = useHistory()
  let {id} = useParams();  
  const [postObject, setPostObject] = useState({});
  const  [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const {authState} = useContext(AuthContext);
  

  useEffect(()=>{
    axios.get(`http://localhost:8000/posts/byId/${id}`)
      .then((response)=>{
        setPostObject(response.data);
        console.log(response);
      },);

      axios.get(`http://localhost:8000/comments/${id}`)
      .then((response)=>{
        setComments(response.data);
      });
  }, []);
  
  const addComment = ()=>{

  
    axios.post('http://localhost:8000/comments', {
      commentBody:newComment ,
       PostId:id
      },
      {
        headers:{
          accessToken: localStorage.getItem("accessToken"),
          
        }
      }
      )
    .then((response)=>{
    
      if (response.data.error){
      alert("Login Please !");
      history.push('/login');  
      }else{
        const commentToAdd = {
          commentBody:newComment,
          username: response.data.username,
          id: response.data.id,
          createdAt: response.data.createdAt
        };
        setComments([...comments, commentToAdd]);
        setNewComment('');// will clear the last comment in the input  
      }  
    })
  }

/////////      fonction for delete one post
  const deleteOnePost = (id) => {
    console.log(id);
    axios.delete(`http://localhost:8000/posts/byId/${id}`, {
      headers:{
        accessToken: localStorage.getItem("accessToken"),      
      },
    })
    .then((response) => {
      console.log(response);
      setPostObject({});
       history.push('/');  
    })

  }


  ////////      fonction for delete one comment    ///////////////
  const deleteComment = (id) =>{ 
  
    axios.delete(`http://localhost:8000/comments/${id}`,{
      headers:{
        accessToken: localStorage.getItem("accessToken"),      
      },
    })
    .then(()=>{
     setComments(
       comments.filter((val) => {
       console.log(val);
         return val.id !==id;
         
       })
     )
    })

  }


  return (
     <div className="postPage">
       <div className="leftSide">
         <div className="post" id="individual">
           <div className="title"> {postObject.title}</div>
           <div className="body"> {postObject.postText}</div>
           <div className="footer"> 
           {postObject.username}
           {
              authState.username ===postObject.username 
              &&
            (<DeleteIcon className="deleteBtn" onClick={() => {
              deleteOnePost(postObject.id)
            }} />)
           }
         
           </div>
         </div>
       </div>
       <div className="rightSide">
         <div className="addCommentContainer">
           <input 
           type="text" 
           placeholder="Write your Comment..." 
           value={newComment}
           onChange ={(event)=>{
             setNewComment(event.target.value)
           }}/>
           <button onClick={addComment}>Add Comment</button>
         </div> 
         <div className="listOfComments">
           {comments.map((comment, key)=>{
             return <div key={key} className="comment">
               <div className="commentBody"> {comment.commentBody}
               </div>
               <div className="commentFooter">
                 <p>Username: {comment.username}</p>
                 <p>Date: <Moment format="YYYY/MM/DD hh:mm:ss">
                   {comment.createdAt}
                   </Moment>
                 </p>

             
                 { 
                 authState.username ===comment.username 
                 && 
                 (<DeleteIcon className="deleteBtn" onClick={() =>   {
                   deleteComment(comment.id);
                 }} />)
                 }

               </div>
              
               
               </div>
           })}
         </div>
       </div>
     </div>
  )
}


export default Post
