import React, { Component } from 'react'
import './About.css'

class About extends Component {
    render () {
        return (
            <section className="about">
                <p>Welcome to my webpage. My name is Medhir Bhargava, and I am a Seattle-based software engineer and visual artist.</p>
                <p>My interests span many domains, including web application development, biology, graphic design, generative art, and computer science education.</p>
                <p>My current choice of tools includes React and Go for application development, and Blender for creative endeavors.</p>
                <p>You can view some of my work through this site and <a href="https://github.com/medhir">Github</a>, connect with me on <a href="https://linkedin.com/in/medhir">LinkedIn</a>, or send me an e-mail via mail AT medhir.com.</p>
            </section>
        )
    }
}

export default About;