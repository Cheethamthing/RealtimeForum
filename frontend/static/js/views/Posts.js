import AbstractView from "./AbstractView.js";
import Nav from "./Nav.js";

export default class Posts extends AbstractView {
	constructor() {
		super();
		this.setTitle("Posts");
	}

	async getHTML() {
		const nav = new Nav(); // Create an instance of the Nav class
		const navHTML = await nav.getHTML(); // Get the HTML content for the navigation

		return `
      ${navHTML}
      <div class="post-form">
        <form id="post-form" method="POST">
          <p>Kindly fill in this form to post.</p>
          <div class="input-row">
            <div class="input-field">
              <label for="post"><b>Post</b></label>
              <input
                type="text"
                placeholder="Enter Message"
                name="postText"
                id="postText"
                required
              />
            </div>
            <div class="input-field">
              <label for="categories"><b>Categories</b></label>
              <input
                type="text"
                placeholder="Enter Categories"
                name="categories"
                id="categories"
                required
              />
            </div>
            <div class="input-field">
              <label for="image"><b>Image</b></label>
              <input
                type="text"
                placeholder="Enter Image String"
                name="image"
                id="image"
                required
              />
            </div>
          </div>
          <button class="btn" id="submit">Submit Post</button>
        </form>
      </div>

      <div class="contentContainer">
        <div id="leftContainer" class="contentContainer-left">left container</div>
        <div id="postContainer" class="contentContainer-post"></div>
        <div id="rightContainer" class="contentContainer-right">right container, probably chat</div>
      </div>
    `;
	}

	async submitForm() {
		const postForm = document.getElementById("post-form");
		console.log("postform is:", postForm);

		postForm.addEventListener(
			"submit",
			async function (event) {
				event.preventDefault();
				const postText = document.getElementById("postText").value;
				const categories = document.getElementById("categories").value;
				const image = document.getElementById("image").value;
				console.log("submitted post:", postText, categories, image);

				try {
					const response = await fetch("http://localhost:8080/posts", {
						method: "POST",
						headers: {
							Accept: "application/json",
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							body: postText,
							categories: categories,
							img: image,
						}),
					});

					if (response.ok) {
						document.getElementById("postText").value = "";
						document.getElementById("categories").value = "";
						document.getElementById("image").value = "";

						await this.getPosts();
					}
				} catch (error) {
					console.log(error);
				}
			}.bind(this)
		);
	}

	async getPosts() {
		let html = `
      <div>
        <div id="postContainer"></div>
      </div>
    `;

		container.innerHTML += html;

		const response = await fetch("http://localhost:8080/posts");
		const postContainer = document.getElementById("postContainer");
		postContainer.innerHTML = "";

		const posts = await response.json();

		for (const post of posts) {
			const postElement = document.createElement("div");
			postElement.id = "Post" + post.id;
			postElement.classList.add("post");

			const comments = await fetchComments(post.id); // Wait for the comments to be fetched

			postElement.textContent = `
        Id: ${post.id},
        Username: ${post.username},
        Img: ${post.img},
        Body: ${post.body},
        Categories: ${post.categories},
        Reaction: ${post.reaction},
      `;

			let commentHTML = `
        <form id="comment-form" class="comment-form" method="POST">
          <label for="commentText"><b>Comment</b></label>
          <input type="text" placeholder="Enter comment" name="commentText" id="commentText" required /><br>
          <input type="hidden" name="postId" id="postId" value="${post.id}" />
          My value is ${post.id}
          <button type="submit" id="commentSubmit" class="btn">Submit Comment</button>
        </form>
      `;

			if (comments.length > 0) {
				const commentsContainer = document.createElement("div");
				commentsContainer.id = "commentContainer";
				let commentsNum = 1;
				comments.forEach((comment) => {
					const commentElement = document.createElement("div");
					commentElement.className = "comment" + commentsNum++;
					commentElement.textContent = `Comment: ${comment.body}`;
					commentsContainer.appendChild(commentElement);
				});

				postElement.appendChild(commentsContainer);
			}
			postElement.innerHTML += commentHTML;
			postContainer.appendChild(postElement);
		}

		// Comments need to be reworked, currently very inefficient.  Probably foreign keys will be involved
		async function fetchComments(parentPostID) {
			const response = await fetch("http://localhost:8080/comments");
			const comments = await response.json();
			return comments.filter((comment) => comment.parentPostId == parentPostID);
		}
	}

	/* The `async submitCommentForm()` function is responsible for handling the submission of the comment
	  form. It listens for the "submit" event on the comment form, prevents the default form submission
	  behavior, and retrieves the comment text from the input field. */
	  async submitCommentForm() {
		const commentForms = document.querySelectorAll(".comment-form");
		
		commentForms.forEach((commentForm) => {
			var postId = Number(document.getElementById("postId").value)
		  commentForm.addEventListener("submit", async function(event) {
			event.preventDefault();
	  
			const commentText = document.getElementById("commentText").value;
			;
			try {
			  const response = await fetch("http://localhost:8080/comments", {
				method: "POST",
				headers: {
				  Accept: "application/json",
				  "Content-Type": "application/json",
				},
				body: JSON.stringify({
				  body: commentText,
				  parentPostId: Number(postId),
				}),
			  });
			//   postId = postId-1
			  console.log(postId, "is postId")
			  if (response.ok) {
				document.getElementById("commentText").value = "";
				await this.getPosts();
			  }
			} catch (error) {
			  console.log(error);
			}
		  }.bind(this));
		});
	  }
	  

}
