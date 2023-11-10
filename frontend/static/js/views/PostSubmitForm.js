import AbstractView from "./AbstractView.js"
import Posts from "./Post.js"

export default class PostSubmitForm extends AbstractView {
	async renderHTML() {
		return `<div class="post-form">
    <form id="post-form" method="POST">
      <p>Kindly fill in this form to post.</p>
     
        <div class="post-form-input-field">
          <label for="postText"><b>Post</b></label>
          <input
            type="text"
            placeholder="Enter Message"
            name="postText"
            id="postText"
            required
          />
        </div>

        <b>Categories</b>
        <ul>
		<label for="Dogs"><input type="checkbox" id="Dogs" name="Category" class="Category" value="Dogs"> Dogs</label>
		<label for="Sausages"><input type="checkbox" id="Sausages" name="Category" class="Category" value="Sausages"> Sausages</label>
		<label for="Cats"><input type="checkbox" id="Cats" name="Category" class="Category" value="Cats"> Cats</label>
		<label for="Meows"><input type="checkbox" id="Meows" name="Category" class="Category" value="Meows"> Meows</label>
       </ul>
        <div class="post-form-input-field">
          <label for="image"><b>Image</b></label>
          <input
            type="text"
            placeholder="Enter Image String"
            name="image"
            id="image"
            required
          />
        </div>
      
      <button class="postSubmitButton" id="submit">Submit Post</button>
    </form>
  </div>`
	}

	async handlePostSubmission() {
		const postForm = document.getElementById("post-form")

		postForm.addEventListener(
			"submit",
			async function (event) {
				event.preventDefault()
				const currentUserID = Number(localStorage.getItem("id"))
				const postText = document.getElementById("postText").value
				const categoriesCheckboxes = document.querySelectorAll(
					'input[name="Category"]:checked'
				)
				const categories = Array.from(categoriesCheckboxes).map(
					(categoriesCheckboxes) => categoriesCheckboxes.value
				)

				const image = document.getElementById("image").value
				console.log("submitted post:", postText, categories, image)

				try {
					const response = await fetch("https://localhost:8080/api/addposts", {
						method: "POST",
						headers: {
							Accept: "application/json",
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							userID: currentUserID,
							img: image,
							body: postText,
							categories: categories,
							
						}),
						credentials: "include",
					})
					if (response.ok) {
						// clears the submitted form values, unsure if this helps but apparently it's good practice
						document.getElementById("postText").value = ""
						const checkboxes = document.querySelectorAll(
							'input[type="checkbox"]'
						)
						checkboxes.forEach((checkbox) => {
							checkbox.checked = false
						})
						document.getElementById("image").value = ""
						const postsContainer = document.getElementById("postsContainer")
						const posts = new Posts()
						const highestNumber = await this.newHighestPostContainerNumber();
						const newPost = {
							id: highestNumber,
							userID: currentUserID, 
							username: localStorage.getItem("username"),
							img: image,
							body: postText,
							categories: categories,
							reactionID: 0, // Reaction ID
							postLikes: 0, // Number of likes
							postDislikes: 0, // Number of dislikes
							comments: [],
						  };
						  
					

						// Call displayPostContainer to refresh the post container
						await posts.processPost(postsContainer, newPost)
						// await posts.renderHTML()
					}
					if (response.status == 408) {
						window.location.href = "/"
					}
				} catch (error) {
					console.log(error)
				}
			}.bind(this)
		)
	}

	async newHighestPostContainerNumber() {
		// Select all the post containers
		const postContainers = document.querySelectorAll(".postContainer");
	  
		// Initialize the highest number to 0
		let highestNumber = 0;
	  
		// Loop through the post containers
		postContainers.forEach((container) => {
		  // Extract the post number from the container's ID
		  const containerId = container.id;
		  const matches = containerId.match(/(\d+)$/);
		  if (matches && matches.length > 1) {
			const number = parseInt(matches[1], 10);
			if (number > highestNumber) {
			  highestNumber = number;
			}
		  }
		});
	  
		return highestNumber + 1;
	  }
	  
	  
	  // Example usage
	  
	  
	  
}
