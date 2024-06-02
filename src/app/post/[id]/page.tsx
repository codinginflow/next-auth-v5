// Import the Prisma client for database operations
import prisma from "@/lib/prisma";

// Import the notFound function to handle 404 errors
import { notFound } from "next/navigation";
// Import the cache function from React to cache data
import { cache } from "react";

// Define the shape of the page's props
interface PageProps {
  params: { id: string }; // Page parameters include a post ID
}

// Function to get post data, caching the result for performance
const getPost = cache(async (id: string) => {
    return prisma.post.findUnique({
      where: { postId: id }, // Find post by ID
      include: { 
        user: { 
          select: { name: true, role:true } 
        } 
      }
    });
});

  

// Function to generate static parameters for dynamic routes
export async function generateStaticParams() {
  const allPosts = await prisma.post.findMany(); // Get all posts from the database

  return allPosts.map(({ postId }) => ({ id: postId })); // Return an array of post IDs
}

// Function to generate metadata for each page
export async function generateMetadata({ params: { id } }: PageProps) {
  const post = await getPost(id); // Get post data by ID

  return {
    title: post?.title || `Post ${id}`, // Set the page title to the post title or default to "Post [ID]"
  };
}

// Main page component
export default async function Page({ params: { id } }: PageProps) {
  // Artificial delay to simulate loading time
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const post = await getPost(id); // Get post data by ID
  const formattedRole = (post?.user.role || "").replace(/\b\w/g, (char) => char.toUpperCase());

  const formatDate = (dateString: string): string => {
    const currentDate = new Date();
    const postDate = new Date(dateString);
    const timeDifference = currentDate.getTime() - postDate.getTime();
    const secondsDifference = Math.floor(timeDifference / 1000);
    const minutesDifference = Math.floor(secondsDifference / 60);
    const hoursDifference = Math.floor(minutesDifference / 60);
    const daysDifference = Math.floor(hoursDifference / 24);
    const monthsDifference = Math.floor(daysDifference / 30);
    const yearsDifference = Math.floor(monthsDifference / 12);
  
    if (yearsDifference > 0) {
      return `${yearsDifference} year${yearsDifference > 1 ? 's' : ''} ago`;
    } else if (monthsDifference > 0) {
      return `${monthsDifference} month${monthsDifference > 1 ? 's' : ''} ago`;
    } else if (daysDifference > 0) {
      return `${daysDifference} day${daysDifference > 1 ? 's' : ''} ago`;
    } else if (hoursDifference > 0) {
      return `${hoursDifference} hour${hoursDifference > 1 ? 's' : ''} ago`;
    } else if (minutesDifference > 0) {
      return `${minutesDifference} minute${minutesDifference > 1 ? 's' : ''} ago`;
    } else {
      return `${secondsDifference} second${secondsDifference > 1 ? 's' : ''} ago`;
    }
  };
  
  if (!post) notFound(); // If no post is found, show a 404 error
  const dateString = new Date(post.createdAt).toLocaleString();
  return (
    
    <>
<main className="pt-8 pb-16 lg:pt-16 lg:pb-24 bg-white dark:bg-gray-900 antialiased">
<div className="flex justify-between px-4 mx-auto max-w-screen-xl ">
<article className="mx-auto w-full max-w-2xl format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
    <header className="mb-4 lg:mb-6 not-format">
        <address className="flex items-center mb-6 not-italic">
            <div className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white">
                <img className="mr-4 w-16 h-16 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-2.jpg" alt="Jese Leos"/>
                <div>
                <a href="#" rel="author" className="text-xl font-bold text-gray-900 dark:text-white">
                {post?.user.name}
                {post?.user.role === "contributor" && (
                <span className="ml-2" title="Contributor" style={{ display: "inline-block", color: "currentColor", verticalAlign: "middle" }}>
                    <svg className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m4.988 19.012 5.41-5.41m2.366-6.424 4.058 4.058-2.03 5.41L5.3 20 4 18.701l3.355-9.494 5.41-2.029Zm4.626 4.625L12.197 6.61 14.807 4 20 9.194l-2.61 2.61Z"/>
                    </svg>
                </span>
                )}

                {post?.user.role === "admin" && (
                <span className="ml-2" title="Admin" style={{ display: "inline-block", color: "currentColor", verticalAlign: "middle" }}>
                    <svg className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M17 10v1.126c.367.095.714.24 1.032.428l.796-.797 1.415 1.415-.797.796c.188.318.333.665.428 1.032H21v2h-1.126c-.095.367-.24.714-.428 1.032l.797.796-1.415 1.415-.796-.797a3.979 3.979 0 0 1-1.032.428V20h-2v-1.126a3.977 3.977 0 0 1-1.032-.428l-.796.797-1.415-1.415.797-.796A3.975 3.975 0 0 1 12.126 16H11v-2h1.126c.095-.367.24-.714.428-1.032l-.797-.796 1.415-1.415.796.797A3.977 3.977 0 0 1 15 11.126V10h2Zm.406 3.578.016.016c.354.358.574.85.578 1.392v.028a2 2 0 0 1-3.409 1.406l-.01-.012a2 2 0 0 1 2.826-2.83ZM5 8a4 4 0 1 1 7.938.703 7.029 7.029 0 0 0-3.235 3.235A4 4 0 0 1 5 8Zm4.29 5H7a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h6.101A6.979 6.979 0 0 1 9 15c0-.695.101-1.366.29-2Z" clipRule="evenodd"/>
                    </svg>
                </span>
                )}


                </a>


                    {/* <p className="text-base text-gray-500 dark:text-gray-400">{formattedRole}</p> */}
                    <p className="text-base text-gray-500 dark:text-gray-400">
                        <div className="text-gray-600"> 

                            <p id="date" title={new Date(dateString).toLocaleString('en-US', {
                            weekday: 'long', // Display the full name of the day of the week
                            month: 'long', // Display the full name of the month
                            day: 'numeric', // Display the day of the month
                            year: 'numeric', // Display the year
                            hour: 'numeric', // Display the hour
                            minute: 'numeric', // Display the minute
                            hour12: true, // Use 12-hour time format
                            })}>{formatDate(dateString)}</p>

                        </div>
</p>
                </div>
            </div>
        </address>
        <h1 className="mb-4 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-6 lg:text-4xl dark:text-white">{post?.title || `Post ${id}`}</h1>
    </header>
    <p className="lead">{post?.details}</p>
    <figure><img src="https://flowbite.s3.amazonaws.com/typography-plugin/typography-image-1.png" alt=""/>
        <figcaption>Digital art by Anonymous</figcaption>
    </figure>
    <h2>Getting started with Flowbite</h2>
    <p>First of all you need to understand how Flowbite works. This library is not another framework.
        Rather, it is a set of components based on Tailwind CSS that you can just copy-paste from the
        documentation.</p>
    <p>It also includes a JavaScript file that enables interactive components, such as modals, dropdowns,
        and datepickers which you can optionally include into your project via CDN or NPM.</p>
    <p>You can check out the <a href="https://flowbite.com/docs/getting-started/quickstart/">quickstart
            guide</a> to explore the elements by including the CDN files into your project. But if you want
        to build a project with Flowbite I recommend you to follow the build tools steps so that you can
        purge and minify the generated CSS.</p>
    <p>You will also receive a lot of useful application UI, marketing UI, and e-commerce pages that can help
        you get started with your projects even faster. You can check out this <a
            href="https://flowbite.com/docs/components/tables/">comparison table</a> to better understand
        the differences between the open-source and pro version of Flowbite.</p>
    <h2>When does design come in handy?</h2>
    <p>While it might seem like extra work at a first glance, here are some key moments in which prototyping
        will come in handy:</p>
    <ol>
        <li><strong>Usability testing</strong>. Does your user know how to exit out of screens? Can they
            follow your intended user journey and buy something from the site you’ve designed? By running a
            usability test, you’ll be able to see how users will interact with your design once it’s live;
        </li>
        <li><strong>Involving stakeholders</strong>. Need to check if your GDPR consent boxes are displaying
            properly? Pass your prototype to your data protection team and they can test it for real;</li>
        <li><strong>Impressing a client</strong>. Prototypes can help explain or even sell your idea by
            providing your client with a hands-on experience;</li>
        <li><strong>Communicating your vision</strong>. By using an interactive medium to preview and test
            design elements, designers and developers can understand each other — and the project — better.
        </li>
    </ol>
    <h3>Laying the groundwork for best design</h3>
    <p>Before going digital, you might benefit from scribbling down some ideas in a sketchbook. This way,
        you can think things through before committing to an actual design project.</p>
    <p>Lets start by including the CSS file inside the <code>head</code> tag of your HTML.</p>
    <h3>Understanding typography</h3>
    <h4>Type properties</h4>
    <p>A typeface is a collection of letters. While each letter is unique, certain shapes are shared across
        letters. A typeface represents shared patterns across a collection of letters.</p>
    <h4>Baseline</h4>
    <p>A typeface is a collection of letters. While each letter is unique, certain shapes are shared across
        letters. A typeface represents shared patterns across a collection of letters.</p>
    <h4>Measurement from the baseline</h4>
    <p>A typeface is a collection of letters. While each letter is unique, certain shapes are shared across
        letters. A typeface represents shared patterns across a collection of letters.</p>
    <h3>Type classification</h3>
    <h4>Serif</h4>
    <p>A serif is a small shape or projection that appears at the beginning or end of a stroke on a letter.
        Typefaces with serifs are called serif typefaces. Serif fonts are classified as one of the
        following:</p>
    <h4>Old-Style serifs</h4>
    <ul>
        <li>Low contrast between thick and thin strokes</li>
        <li>Diagonal stress in the strokes</li>
        <li>Slanted serifs on lower-case ascenders</li>
    </ul><img src="https://flowbite.s3.amazonaws.com/typography-plugin/typography-image-2.png" alt=""/>
    <ol>
        <li>Low contrast between thick and thin strokes</li>
        <li>Diagonal stress in the strokes</li>
        <li>Slanted serifs on lower-case ascenders</li>
    </ol>
    <h3>Laying the best for successful prototyping</h3>
    <p>A serif is a small shape or projection that appears at the beginning:</p>
    <blockquote>
        <p>Flowbite is just awesome. It contains tons of predesigned components and pages starting from
            login screen to complex dashboard. Perfect choice for your next SaaS application.</p>
    </blockquote>
    <h4>Code example</h4>
    <p>A serif is a small shape or projection that appears at the beginning or end of a stroke on a letter.
        Typefaces with serifs are called serif typefaces. Serif fonts are classified as one of the
        following:</p>
    <pre>
      {/* <code className="language-html">&lt;dl className="grid grid-cols-2 gap-8 max-w-screen-md text-gray-900 sm:grid-cols-3 dark:text-white"&gt;
&lt;div className="flex flex-col justify-center items-center"&gt;
&lt;dt className="mb-2 text-3xl font-extrabold"&gt;73M+&lt;/dt&gt;
&lt;dd className="text-lg font-normal text-gray-500 dark:text-gray-400"&gt;developers&lt;/dd&gt;
&lt;/div&gt;
&lt;div className="flex flex-col justify-center items-center"&gt;
&lt;dt className="mb-2 text-3xl font-extrabold"&gt;1B+&lt;/dt&gt;
&lt;dd className="text-lg font-normal text-gray-500 dark:text-gray-400"&gt;contributors&lt;/dd&gt;
&lt;/div&gt;
&lt;div className="flex flex-col justify-center items-center"&gt;
&lt;dt className="mb-2 text-3xl font-extrabold"&gt;4M+&lt;/dt&gt;
&lt;dd className="text-lg font-normal text-gray-500 dark:text-gray-400"&gt;organizations&lt;/dd&gt;
&lt;/div&gt;
&lt;/dl&gt;
</code> */}
</pre>
    <h4>Table example</h4>
    <p>A serif is a small shape or projection that appears at the beginning or end of a stroke on a letter.
    </p>
    <table>
        <thead>
            <tr>
                <th>Country</th>
                <th>Date &amp; Time</th>
                <th>Amount</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>United States</td>
                <td>April 21, 2021</td>
                <td><strong>$2,300</strong></td>
            </tr>
            <tr>
                <td>Canada</td>
                <td>May 31, 2021</td>
                <td><strong>$300</strong></td>
            </tr>
            <tr>
                <td>United Kingdom</td>
                <td>June 3, 2021</td>
                <td><strong>$2,500</strong></td>
            </tr>
            <tr>
                <td>Australia</td>
                <td>June 23, 2021</td>
                <td><strong>$3,543</strong></td>
            </tr>
            <tr>
                <td>Germany</td>
                <td>July 6, 2021</td>
                <td><strong>$99</strong></td>
            </tr>
            <tr>
                <td>France</td>
                <td>August 23, 2021</td>
                <td><strong>$2,540</strong></td>
            </tr>
        </tbody>
    </table>
    <h3>Best practices for setting up your prototype</h3>
    <p><strong>Low fidelity or high fidelity?</strong> Fidelity refers to how close a prototype will be to
        the real deal. If you’re simply preparing a quick visual aid for a presentation, a low-fidelity
        prototype — like a wireframe with placeholder images and some basic text — would be more than
        enough. But if you’re going for more intricate usability testing, a high-fidelity prototype — with
        on-brand colors, fonts and imagery — could help get more pointed results.</p>
    <p><strong>Consider your user</strong>. To create an intuitive user flow, try to think as your user
        would when interacting with your product. While you can fine-tune this during beta testing,
        considering your user’s needs and habits early on will save you time by setting you on the right
        path.</p>
    <p><strong>Start from the inside out</strong>. A nice way to both organize your tasks and create more
        user-friendly prototypes is by building your prototypes ‘inside out’. Start by focusing on what will
        be important to your user, like a Buy now button or an image gallery, and list each element by order
        of priority. This way, you’ll be able to create a prototype that puts your users’ needs at the heart
        of your design.</p>
    <p>And there you have it! Everything you need to design and share prototypes — right in Flowbite Figma.
    </p>
    <section className="not-format">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Discussion (20)</h2>
        </div>
        {/* <form className="mb-6">
            <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <label htmlFor="comment" className="sr-only">Your comment</label>
                <textarea
                  id="comment"
                  rows='6'
                  className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                  placeholder="Write a comment..."
                  required
                ></textarea>

            </div>
            <button type="submit"
                className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                Post comment
            </button>
        </form> */}
        <article className="p-6 mb-6 text-base bg-white rounded-lg dark:bg-gray-900">
            <footer className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                    <p className="inline-flex items-center mr-3 font-semibold text-sm text-gray-900 dark:text-white">
                      <img
                            className="mr-2 w-6 h-6 rounded-full"
                            src="https://flowbite.com/docs/images/people/profile-picture-2.jpg"
                            alt="Michael Gough"/>Michael Gough</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Feb. 8, 2022</p>
                </div>
                <button id="dropdownComment1Button" data-dropdown-toggle="dropdownComment1"
                    className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:text-gray-400 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                    type="button">
                      <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
                          <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/>
                      </svg>
                    <span className="sr-only">Comment settings</span>
                </button>
                {/* Dropdown menu  */}
                <div id="dropdownComment1"
                    className="hidden z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                    <ul className="py-1 text-sm text-gray-700 dark:text-gray-200"
                        aria-labelledby="dropdownMenuIconHorizontalButton">
                        <li>
                            <a href="#"
                                className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Edit</a>
                        </li>
                        <li>
                            <a href="#"
                                className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Remove</a>
                        </li>
                        <li>
                            <a href="#"
                                className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Report</a>
                        </li>
                    </ul>
                </div>
            </footer>
            <p>Very straight-to-point article. Really worth time reading. Thank you! But tools are just the
                instruments for the UX designers. The knowledge of the design tools are as important as the
                creation of the design strategy.</p>
            <div className="flex items-center mt-4 space-x-4">
                <button type="button"
                    className="flex items-center font-medium text-sm text-gray-500 hover:underline dark:text-gray-400">
                      <svg className="mr-1.5 w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                      <path d="M18 0H2a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2v4a1 1 0 0 0 1.707.707L10.414 13H18a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5 4h2a1 1 0 1 1 0 2h-2a1 1 0 1 1 0-2ZM5 4h5a1 1 0 1 1 0 2H5a1 1 0 0 1 0-2Zm2 5H5a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Zm9 0h-6a1 1 0 0 1 0-2h6a1 1 0 1 1 0 2Z"/>
                      </svg>
                    Reply
                </button>
            </div>
        </article>
        <article className="p-6 mb-6 ml-6 lg:ml-12 text-base bg-white rounded-lg dark:bg-gray-900">
            <footer className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                    <p className="inline-flex items-center mr-3 font-semibold text-sm text-gray-900 dark:text-white"><img
                            className="mr-2 w-6 h-6 rounded-full"
                            src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                            alt="Jese Leos"/>Jese Leos</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Feb. 12, 2022</p>
                </div>
                <button id="dropdownComment2Button" data-dropdown-toggle="dropdownComment2"
                    className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:text-gray-400 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                    type="button">
                      <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
                          <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/>
                      </svg>
                    <span className="sr-only">Comment settings</span>
                </button>
                {/* Dropdown menu */}
                <div id="dropdownComment2"
                    className="hidden z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                    <ul className="py-1 text-sm text-gray-700 dark:text-gray-200"
                        aria-labelledby="dropdownMenuIconHorizontalButton">
                        <li>
                            <a href="#"
                                className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Edit</a>
                        </li>
                        <li>
                            <a href="#"
                                className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Remove</a>
                        </li>
                        <li>
                            <a href="#"
                                className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Report</a>
                        </li>
                    </ul>
                </div>
            </footer>
            <p>Much appreciated! Glad you liked it ☺️</p>
            <div className="flex items-center mt-4 space-x-4">
                <button type="button"
                    className="flex items-center font-medium text-sm text-gray-500 hover:underline dark:text-gray-400">
                      <svg className="mr-1.5 w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                          <path d="M18 0H2a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2v4a1 1 0 0 0 1.707.707L10.414 13H18a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5 4h2a1 1 0 1 1 0 2h-2a1 1 0 1 1 0-2ZM5 4h5a1 1 0 1 1 0 2H5a1 1 0 0 1 0-2Zm2 5H5a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Zm9 0h-6a1 1 0 0 1 0-2h6a1 1 0 1 1 0 2Z"/>
                      </svg>
                    Reply
                </button>
            </div>
        </article>
        <article className="p-6 mb-6 text-base bg-white border-t border-gray-200 dark:border-gray-700 dark:bg-gray-900">
            <footer className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                    <p className="inline-flex items-center mr-3 font-semibold text-sm text-gray-900 dark:text-white"><img
                            className="mr-2 w-6 h-6 rounded-full"
                            src="https://flowbite.com/docs/images/people/profile-picture-3.jpg"
                            alt="Bonnie Green"/>Bonnie Green</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Mar. 12, 2022</p>
                </div>
                <button id="dropdownComment3Button" data-dropdown-toggle="dropdownComment3"
                    className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:text-gray-400 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                    type="button">
                      <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
                          <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/>
                      </svg>
                    <span className="sr-only">Comment settings</span>
                </button>
                {/* Dropdown menu */}
                <div id="dropdownComment3"
                    className="hidden z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                    <ul className="py-1 text-sm text-gray-700 dark:text-gray-200"
                        aria-labelledby="dropdownMenuIconHorizontalButton">
                        <li>
                            <a href="#"
                                className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Edit</a>
                        </li>
                        <li>
                            <a href="#"
                                className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Remove</a>
                        </li>
                        <li>
                            <a href="#"
                                className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Report</a>
                        </li>
                    </ul>
                </div>
            </footer>
            <p>The article covers the essentials, challenges, myths and stages the UX designer should consider while creating the design strategy.</p>
            <div className="flex items-center mt-4 space-x-4">
                <button type="button"
                    className="flex items-center font-medium text-sm text-gray-500 hover:underline dark:text-gray-400">
                    <svg className="mr-1.5 w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                      <path d="M18 0H2a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2v4a1 1 0 0 0 1.707.707L10.414 13H18a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5 4h2a1 1 0 1 1 0 2h-2a1 1 0 1 1 0-2ZM5 4h5a1 1 0 1 1 0 2H5a1 1 0 0 1 0-2Zm2 5H5a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Zm9 0h-6a1 1 0 0 1 0-2h6a1 1 0 1 1 0 2Z"/>
                    </svg>
                    Reply
                </button>
            </div>
        </article>
        <article className="p-6 text-base bg-white border-t border-gray-200 dark:border-gray-700 dark:bg-gray-900">
            <footer className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                    <p className="inline-flex items-center mr-3 font-semibold text-sm text-gray-900 dark:text-white"><img
                            className="mr-2 w-6 h-6 rounded-full"
                            src="https://flowbite.com/docs/images/people/profile-picture-4.jpg"
                            alt="Helene Engels"/>Helene Engels</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Jun. 23, 2022</p>
                </div>
                <button id="dropdownComment4Button" data-dropdown-toggle="dropdownComment4"
                    className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:text-gray-400 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                    type="button">
                      <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
                          <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/>
                      </svg>
                </button>
                {/* Dropdown menu */}
                <div id="dropdownComment4"
                    className="hidden z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                    <ul className="py-1 text-sm text-gray-700 dark:text-gray-200"
                        aria-labelledby="dropdownMenuIconHorizontalButton">
                        <li>
                            <a href="#"
                                className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Edit</a>
                        </li>
                        <li>
                            <a href="#"
                                className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Remove</a>
                        </li>
                        <li>
                            <a href="#"
                                className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Report</a>
                        </li>
                    </ul>
                </div>
            </footer>
            <p>Thanks for sharing this. I do came from the Backend development and explored some of the tools to design my Side Projects.</p>
            <div className="flex items-center mt-4 space-x-4">
                <button type="button"
                    className="flex items-center font-medium text-sm text-gray-500 hover:underline dark:text-gray-400">
                    <svg className="mr-1.5 w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                      <path d="M18 0H2a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2v4a1 1 0 0 0 1.707.707L10.414 13H18a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5 4h2a1 1 0 1 1 0 2h-2a1 1 0 1 1 0-2ZM5 4h5a1 1 0 1 1 0 2H5a1 1 0 0 1 0-2Zm2 5H5a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Zm9 0h-6a1 1 0 0 1 0-2h6a1 1 0 1 1 0 2Z"/>
                    </svg>
                    Reply
                </button>
            </div>
        </article>
    </section>
</article>
</div>
</main>

{/* <aside aria-label="Related articles" className="py-8 lg:py-24 bg-gray-50 dark:bg-gray-800">
<div className="px-4 mx-auto max-w-screen-xl">
<h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">Related articles</h2>
<div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
    <article className="max-w-xs">
        <a href="#">
            <img src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/article/blog-1.png" className="mb-5 rounded-lg" alt="Image 1"/>
        </a>
        <h2 className="mb-2 text-xl font-bold leading-tight text-gray-900 dark:text-white">
            <a href="#">Our first office</a>
        </h2>
        <p className="mb-4 text-gray-500 dark:text-gray-400">Over the past year, Volosoft has undergone many changes! After months of preparation.</p>
        <a href="#" className="inline-flex items-center font-medium underline underline-offset-4 text-primary-600 dark:text-primary-500 hover:no-underline">
            Read in 2 minutes
        </a>
    </article>
    <article className="max-w-xs">
        <a href="#">
            <img src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/article/blog-2.png" className="mb-5 rounded-lg" alt="Image 2"/>
        </a>
        <h2 className="mb-2 text-xl font-bold leading-tight text-gray-900 dark:text-white">
            <a href="#">Enterprise design tips</a>
        </h2>
        <p className="mb-4  text-gray-500 dark:text-gray-400">Over the past year, Volosoft has undergone many changes! After months of preparation.</p>
        <a href="#" className="inline-flex items-center font-medium underline underline-offset-4 text-primary-600 dark:text-primary-500 hover:no-underline">
            Read in 12 minutes
        </a>
    </article>
    <article className="max-w-xs">
        <a href="#">
            <img src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/article/blog-3.png" className="mb-5 rounded-lg" alt="Image 3"/>
        </a>
        <h2 className="mb-2 text-xl font-bold leading-tight text-gray-900 dark:text-white">
            <a href="#">We partnered with Google</a>
        </h2>
        <p className="mb-4  text-gray-500 dark:text-gray-400">Over the past year, Volosoft has undergone many changes! After months of preparation.</p>
        <a href="#" className="inline-flex items-center font-medium underline underline-offset-4 text-primary-600 dark:text-primary-500 hover:no-underline">
            Read in 8 minutes
        </a>
    </article>
    <article className="max-w-xs">
        <a href="#">
            <img src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/article/blog-4.png" className="mb-5 rounded-lg" alt="Image 4"/>
        </a>
        <h2 className="mb-2 text-xl font-bold leading-tight text-gray-900 dark:text-white">
            <a href="#">Our first project with React</a>
        </h2>
        <p className="mb-4  text-gray-500 dark:text-gray-400">Over the past year, Volosoft has undergone many changes! After months of preparation.</p>
        <a href="#" className="inline-flex items-center font-medium underline underline-offset-4 text-primary-600 dark:text-primary-500 hover:no-underline">
            Read in 4 minutes
        </a>
    </article>
</div>
</div>
</aside> */}

<section className="bg-white dark:bg-gray-900">
<div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
<div className="mx-auto max-w-screen-md sm:text-center">
    <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl dark:text-white">Sign up for our newsletter</h2>
    <p className="mx-auto mb-8 max-w-2xl  text-gray-500 md:mb-12 sm:text-xl dark:text-gray-400">Stay up to date with the roadmap progress, announcements and exclusive discounts feel free to sign up with your email.</p>
    <form action="#">
        <div className="items-center mx-auto mb-3 space-y-4 max-w-screen-sm sm:flex sm:space-y-0">
            <div className="relative w-full">
                <label htmlFor="email" className="hidden mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Email address</label>
                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                      <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z"/>
                      <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z"/>
                   </svg>
                </div>
                <input className="block p-3 pl-9 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 sm:rounded-none sm:rounded-l-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Enter your email" type="email" id="email" required/>
            </div>
            <div>
                <button type="submit" className="py-3 px-5 w-full text-sm font-medium text-center text-white rounded-lg border cursor-pointer bg-primary-700 border-primary-600 sm:rounded-none sm:rounded-r-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Subscribe</button>
            </div>
        </div>
        <div className="mx-auto max-w-screen-sm text-sm text-left text-gray-500 newsletter-form-footer dark:text-gray-300">We care about the protection of your data. <a href="#" className="font-medium text-primary-600 dark:text-primary-500 hover:underline">Read our Privacy Policy</a>.</div>
    </form>
</div>
</div>
</section>

<footer className="bg-gray-50 dark:bg-gray-800 antialiased">
<div className="p-4 py-6 mx-auto max-w-screen-xl md:p-8 lg:p-10">
<div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">
    <div>
        <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Company</h2>
        <ul className="text-gray-500 dark:text-gray-400">
            <li className="mb-4">
                <a href="#" className=" hover:underline">About</a>
            </li>
            <li className="mb-4">
                <a href="#" className="hover:underline">Careers</a>
            </li>
            <li className="mb-4">
                <a href="#" className="hover:underline">Brand Center</a>
            </li>
            <li className="mb-4">
                <a href="#" className="hover:underline">Blog</a>
            </li>
        </ul>
    </div>
    <div>
        <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Help center</h2>
        <ul className="text-gray-500 dark:text-gray-400">
            <li className="mb-4">
                <a href="#" className="hover:underline">Discord Server</a>
            </li>
            <li className="mb-4">
                <a href="#" className="hover:underline">Twitter</a>
            </li>
            <li className="mb-4">
                <a href="#" className="hover:underline">Facebook</a>
            </li>
            <li className="mb-4">
                <a href="#" className="hover:underline">Contact Us</a>
            </li>
        </ul>
    </div>
    <div>
        <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Legal</h2>
        <ul className="text-gray-500 dark:text-gray-400">
            <li className="mb-4">
                <a href="#" className="hover:underline">Privacy Policy</a>
            </li>
            <li className="mb-4">
                <a href="#" className="hover:underline">Licensing</a>
            </li>
            <li className="mb-4">
                <a href="#" className="hover:underline">Terms</a>
            </li>
        </ul>
    </div>
    <div>
        <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Company</h2>
        <ul className="text-gray-500 dark:text-gray-400">
            <li className="mb-4">
                <a href="#" className=" hover:underline">About</a>
            </li>
            <li className="mb-4">
                <a href="#" className="hover:underline">Careers</a>
            </li>
            <li className="mb-4">
                <a href="#" className="hover:underline">Brand Center</a>
            </li>
            <li className="mb-4">
                <a href="#" className="hover:underline">Blog</a>
            </li>
        </ul>
    </div>
    <div>
        <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Download</h2>
        <ul className="text-gray-500 dark:text-gray-400">
            <li className="mb-4">
                <a href="#" className="hover:underline">iOS</a>
            </li>
            <li className="mb-4">
                <a href="#" className="hover:underline">Android</a>
            </li>
            <li className="mb-4">
                <a href="#" className="hover:underline">Windows</a>
            </li>
            <li className="mb-4">
                <a href="#" className="hover:underline">MacOS</a>
            </li>
        </ul>
    </div>
</div>
<hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8"/>
<div className="text-center">
    <a href="#" className="flex justify-center items-center mb-5 text-2xl font-semibold text-gray-900 dark:text-white">
        <svg className="mr-2 h-8" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M25.2696 13.126C25.1955 13.6364 24.8589 14.3299 24.4728 14.9328C23.9856 15.6936 23.2125 16.2264 22.3276 16.4114L18.43 17.2265C17.8035 17.3575 17.2355 17.6853 16.8089 18.1621L14.2533 21.0188C13.773 21.5556 13.4373 21.4276 13.4373 20.7075C13.4315 20.7342 12.1689 23.9903 15.5149 25.9202C16.8005 26.6618 18.6511 26.3953 19.9367 25.6538L26.7486 21.7247C29.2961 20.2553 31.0948 17.7695 31.6926 14.892C31.7163 14.7781 31.7345 14.6639 31.7542 14.5498L25.2696 13.126Z" fill="url(#paint0_linear_11430_22515)"/><path d="M23.5028 9.20133C24.7884 9.94288 25.3137 11.0469 25.3137 12.53C25.3137 12.7313 25.2979 12.9302 25.2694 13.1261L28.0141 14.3051L31.754 14.5499C32.2329 11.7784 31.2944 8.92561 29.612 6.65804C28.3459 4.9516 26.7167 3.47073 24.7581 2.34097C23.167 1.42325 21.5136 0.818599 19.8525 0.486816L17.9861 2.90382L17.3965 5.67918L23.5028 9.20133Z" fill="url(#paint1_linear_11430_22515)"/><path d="M1.5336 11.2352C1.5329 11.2373 1.53483 11.238 1.53556 11.2358C1.67958 10.8038 1.86018 10.3219 2.08564 9.80704C3.26334 7.11765 5.53286 5.32397 8.32492 4.40943C11.117 3.49491 14.1655 3.81547 16.7101 5.28323L17.3965 5.67913L19.8525 0.486761C12.041 -1.07341 4.05728 3.51588 1.54353 11.2051C1.54233 11.2087 1.53796 11.2216 1.5336 11.2352Z" fill="url(#paint2_linear_11430_22515)"/><path d="M19.6699 25.6538C18.3843 26.3953 16.8003 26.3953 15.5147 25.6538C15.3402 25.5531 15.1757 25.4399 15.0201 25.3174L12.7591 26.8719L10.8103 30.0209C12.9733 31.821 15.7821 32.3997 18.589 32.0779C20.7013 31.8357 22.7995 31.1665 24.7582 30.0368C26.3492 29.1191 27.7 27.9909 28.8182 26.7195L27.6563 23.8962L25.7762 22.1316L19.6699 25.6538Z" fill="url(#paint3_linear_11430_22515)"/><path d="M15.0201 25.3175C14.0296 24.5373 13.4371 23.3406 13.4371 22.0588V21.931V11.2558C13.4371 10.6521 13.615 10.5494 14.1384 10.8513C13.3323 10.3864 11.4703 8.79036 9.17118 10.1165C7.88557 10.858 6.8269 12.4949 6.8269 13.978V21.8362C6.8269 24.775 8.34906 27.8406 10.5445 29.7966C10.6313 29.874 10.7212 29.9469 10.8103 30.0211L15.0201 25.3175Z" fill="url(#paint4_linear_11430_22515)"/><path d="M28.6604 5.49565C28.6589 5.49395 28.6573 5.49532 28.6589 5.49703C28.9613 5.83763 29.2888 6.23485 29.6223 6.68734C31.3648 9.05099 32.0158 12.0447 31.4126 14.9176C30.8093 17.7906 29.0071 20.2679 26.4625 21.7357L25.7761 22.1316L28.8181 26.7195C34.0764 20.741 34.09 11.5388 28.6815 5.51929C28.6789 5.51641 28.67 5.50622 28.6604 5.49565Z" fill="url(#paint5_linear_11430_22515)"/><path d="M7.09355 13.978C7.09354 12.4949 7.88551 11.1244 9.17113 10.3829C9.34564 10.2822 9.52601 10.1965 9.71002 10.1231L9.49304 7.38962L7.96861 4.26221C5.32671 5.23364 3.1897 7.24125 2.06528 9.83067C1.2191 11.7793 0.75001 13.9294 0.75 16.1888C0.75 18.0243 1.05255 19.7571 1.59553 21.3603L4.62391 21.7666L7.09355 21.0223V13.978Z" fill="url(#paint6_linear_11430_22515)"/><path d="M9.71016 10.1231C10.8817 9.65623 12.2153 9.74199 13.3264 10.3829L13.4372 10.4468L22.3326 15.5777C22.9566 15.9376 22.8999 16.2918 22.1946 16.4392L22.7078 16.332C23.383 16.1908 23.9999 15.8457 24.4717 15.3428C25.2828 14.4782 25.5806 13.4351 25.5806 12.5299C25.5806 11.0468 24.7886 9.67634 23.503 8.93479L16.6911 5.00568C14.1436 3.53627 11.0895 3.22294 8.29622 4.14442C8.18572 4.18087 8.07756 4.2222 7.96875 4.26221L9.71016 10.1231Z" fill="url(#paint7_linear_11430_22515)"/><path d="M20.0721 31.8357C20.0744 31.8352 20.0739 31.8332 20.0717 31.8337C19.6252 31.925 19.1172 32.0097 18.5581 32.0721C15.638 32.3978 12.7174 31.4643 10.5286 29.5059C8.33986 27.5474 7.09347 24.7495 7.09348 21.814L7.09347 21.0222L1.59546 21.3602C4.1488 28.8989 12.1189 33.5118 20.0411 31.8421C20.0449 31.8413 20.0582 31.8387 20.0721 31.8357Z" fill="url(#paint8_linear_11430_22515)"/>
            <defs>
            <linearGradient id="paint0_linear_11430_22515" x1="20.8102" y1="23.9532" x2="23.9577" y2="12.9901" gradientUnits="userSpaceOnUse"><stop stop-color="#1724C9"/><stop offset="1" stop-color="#1C64F2"/></linearGradient>
            <linearGradient id="paint1_linear_11430_22515" x1="28.0593" y1="10.5837" x2="19.7797" y2="2.33321" gradientUnits="userSpaceOnUse"><stop stop-color="#1C64F2"/><stop offset="1" stop-color="#0092FF"/></linearGradient>
            <linearGradient id="paint2_linear_11430_22515" x1="16.9145" y1="5.2045" x2="4.42432" y2="5.99375" gradientUnits="userSpaceOnUse"><stop stop-color="#0092FF"/><stop offset="1" stop-color="#45B2FF"/></linearGradient>
            <linearGradient id="paint3_linear_11430_22515" x1="16.0698" y1="28.846" x2="27.2866" y2="25.8192" gradientUnits="userSpaceOnUse"><stop stop-color="#1C64F2"/><stop offset="1" stop-color="#0092FF"/></linearGradient>
            <linearGradient id="paint4_linear_11430_22515" x1="8.01881" y1="15.8661" x2="15.9825" y2="24.1181" gradientUnits="userSpaceOnUse"><stop stop-color="#1724C9"/><stop offset="1" stop-color="#1C64F2"/></linearGradient>
            <linearGradient id="paint5_linear_11430_22515" x1="26.2004" y1="21.8189" x2="31.7569" y2="10.6178" gradientUnits="userSpaceOnUse"><stop stop-color="#0092FF"/><stop offset="1" stop-color="#45B2FF"/></linearGradient>
            <linearGradient id="paint6_linear_11430_22515" x1="6.11387" y1="9.31427" x2="3.14054" y2="20.4898" gradientUnits="userSpaceOnUse"><stop stop-color="#1C64F2"/><stop offset="1" stop-color="#0092FF"/></linearGradient>
            <linearGradient id="paint7_linear_11430_22515" x1="21.2932" y1="8.78271" x2="10.4278" y2="11.488" gradientUnits="userSpaceOnUse"><stop stop-color="#1724C9"/><stop offset="1" stop-color="#1C64F2"/></linearGradient>
            <linearGradient id="paint8_linear_11430_22515" x1="7.15667" y1="21.5399" x2="14.0824" y2="31.9579" gradientUnits="userSpaceOnUse"><stop stop-color="#0092FF"/><stop offset="1" stop-color="#45B2FF"/></linearGradient>
            </defs>
        </svg>
        Flowbite    
    </a>
    <span className="block text-sm text-center text-gray-500 dark:text-gray-400">© 2021-2022 <a href="#" className="hover:underline">Flowbite™</a>. All Rights Reserved.
    </span>
    <ul className="flex justify-center mt-5 space-x-5">
        <li>
            <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white dark:text-gray-400">
              <svg className="h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 8 19">
                  <path fill-rule="evenodd" d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z" clip-rule="evenodd"/>
              </svg>
            </a>
        </li>
        <li>
            <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white dark:text-gray-400">
              <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path fill="currentColor" d="M12.186 8.672 18.743.947h-2.927l-5.005 5.9-4.44-5.9H0l7.434 9.876-6.986 8.23h2.927l5.434-6.4 4.82 6.4H20L12.186 8.672Zm-2.267 2.671L8.544 9.515 3.2 2.42h2.2l4.312 5.719 1.375 1.828 5.731 7.613h-2.2l-4.699-6.237Z"/>
              </svg>
            </a>
        </li>
        <li>
            <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white dark:text-gray-400">
              <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z" clip-rule="evenodd"/>
              </svg>
            </a>
        </li>
        <li>
            <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white dark:text-gray-400">
              <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 0a10 10 0 1 0 10 10A10.009 10.009 0 0 0 10 0Zm6.613 4.614a8.523 8.523 0 0 1 1.93 5.32 20.094 20.094 0 0 0-5.949-.274c-.059-.149-.122-.292-.184-.441a23.879 23.879 0 0 0-.566-1.239 11.41 11.41 0 0 0 4.769-3.366ZM8 1.707a8.821 8.821 0 0 1 2-.238 8.5 8.5 0 0 1 5.664 2.152 9.608 9.608 0 0 1-4.476 3.087A45.758 45.758 0 0 0 8 1.707ZM1.642 8.262a8.57 8.57 0 0 1 4.73-5.981A53.998 53.998 0 0 1 9.54 7.222a32.078 32.078 0 0 1-7.9 1.04h.002Zm2.01 7.46a8.51 8.51 0 0 1-2.2-5.707v-.262a31.64 31.64 0 0 0 8.777-1.219c.243.477.477.964.692 1.449-.114.032-.227.067-.336.1a13.569 13.569 0 0 0-6.942 5.636l.009.003ZM10 18.556a8.508 8.508 0 0 1-5.243-1.8 11.717 11.717 0 0 1 6.7-5.332.509.509 0 0 1 .055-.02 35.65 35.65 0 0 1 1.819 6.476 8.476 8.476 0 0 1-3.331.676Zm4.772-1.462A37.232 37.232 0 0 0 13.113 11a12.513 12.513 0 0 1 5.321.364 8.56 8.56 0 0 1-3.66 5.73h-.002Z" clip-rule="evenodd"/>
              </svg>
            </a>
        </li>
    </ul>
</div>
</div>
</footer>
</>

  );
}
