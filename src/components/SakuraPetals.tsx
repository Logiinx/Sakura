/**
 * src/components/SakuraPetals.tsx
 *
 * This component renders a purely decorative animation of falling sakura (cherry blossom) petals.
 * It uses direct DOM manipulation within a useEffect hook to create and animate petal elements.
 * The styling and animation keyframes are defined in `src/index.css`.
 */

import React, { useEffect, useRef } from "react"

// Define the SakuraPetals component as a Functional Component (React.FC).
const SakuraPetals: React.FC = () => {
  // Create a ref to attach to the container div.
  // This allows us to directly access the DOM element inside the useEffect hook.
  const containerRef = useRef<HTMLDivElement>(null)
  // Define the number of petals to create.
  const numberOfPetals = 20

  // --- Effect for Creating and Cleaning Up Petals --- //
  useEffect(() => {
    // Get the container DOM element from the ref.
    const containerElement = containerRef.current
    // If the container doesn't exist yet (e.g., during initial render phases), exit the effect.
    if (!containerElement) return

    // Clear any existing petals from previous renders or if the component re-renders.
    containerElement.innerHTML = ""

    // Create the specified number of petal elements.
    for (let i = 0; i < numberOfPetals; i++) {
      createPetal(containerElement)
    }

    // --- Cleanup Function --- //
    // This function runs when the component is unmounted.
    return () => {
      // Check if the container element still exists before trying to clear it.
      if (containerElement) {
        // Remove all petal elements from the container.
        // Setting innerHTML to '' is a common way to clear children,
        // though for more complex scenarios with event listeners, more targeted removal might be needed.
        containerElement.innerHTML = ""
      }
    }
    // Empty dependency array `[]` ensures this effect runs only once when the component mounts
    // and the cleanup function runs only when it unmounts.
  }, []) // No dependencies, runs once on mount.

  /**
   * Helper function to create a single petal element and append it to the container.
   * @param container - The HTMLDivElement to append the petal to.
   */
  const createPetal = (container: HTMLDivElement) => {
    // Create a new div element that will represent a petal.
    const petal = document.createElement("div")

    // --- Randomization for Natural Look --- //
    // Randomly select one of the three petal styles defined in index.css (.petal-1, .petal-2, .petal-3).
    const petalType = Math.floor(Math.random() * 3) + 1
    // Randomize animation duration (falling speed). Between 8 and 18 seconds.
    const fallSpeed = Math.random() * 10 + 8
    // Randomize horizontal starting position across the window width.
    const startPositionX = Math.random() * window.innerWidth
    // Randomize vertical starting position slightly above the viewport (-100px to 0px).
    const startPositionY = Math.random() * -100
    // Randomize animation delay. Between 0 and 15 seconds.
    const animationDelay = Math.random() * 15
    // Randomize initial rotation.
    const initialRotation = Math.random() * 360

    // --- Applying Styles --- //
    // Assign base 'petal' class and the randomly selected type class (e.g., 'petal petal-1').
    petal.className = `petal petal-${petalType}`
    // Set inline styles for randomized properties.
    petal.style.left = `${startPositionX}px` // Horizontal start position
    petal.style.top = `${startPositionY}px` // Vertical start position
    petal.style.animationDuration = `${fallSpeed}s` // How long the 'fall' animation takes
    petal.style.animationDelay = `${animationDelay}s` // When the animation starts
    petal.style.transform = `rotate(${initialRotation}deg)` // Initial rotation

    // Add the newly created and styled petal to the container div in the DOM.
    container.appendChild(petal)
  }

  // --- Render --- //
  // Render the container div.
  // Assign the ref so we can access it in useEffect.
  // Assign the 'sakura-petals' class which defines basic positioning and container styles (see index.css).
  return <div ref={containerRef} className="sakura-petals"></div>
}

export default SakuraPetals
