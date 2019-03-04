const fs = require('fs')
const uuid = require('uuid/v4')

const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max))
}

const potentialTitles = [
    "mental health and programming",
    "how to create an uploading service in React", 
    "Muzzles and measles", 
    "Cats are the real enemy: 2019."
]

const createPost = () => {
    return {
        title: potentialTitles[getRandomInt(4)], 
        published: new Date().getTime(), 
        id: uuid()
    }
}

const createDraft = () => {
    return {
        title: potentialTitles[getRandomInt(4)], 
        saved: new Date().getTime(), 
        id: uuid()
    }
}

const populateBlogJson = (numPosts) => new Promise(resolve => {
    const blog = {
        posts: [], 
        drafts: []
    }

    let count = 0

    setInterval(() => {
        if (count === numPosts) {
            resolve(blog)
        }
        if (count%2 === 1) {
            blog.posts.push(createPost())
        } else {
            blog.drafts.push(createDraft())
        }  
        count++
    }, 10)
})

populateBlogJson(10).then(blog => {
    fs.writeFile("./blogIndex.json", JSON.stringify(blog, null, 2), err => {
        if (err) {
            console.error(err)
            return
        }
        console.log("JSON created :-)")
    })
})