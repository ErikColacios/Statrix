import Footer from '@/components/Footer'
import React from 'react'

export default function PrivacyPolicyPage() {
    return (
        <section className="relative text-gray-300 py-20 w-full">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl text-white font-bold my-4">Privacy Policy</h1>
                <p className="py-4 text-white">Last update: August 13, 2026</p>

                <p>Statrix is a social network designed to connect players with shared interests and allow them to showcase their journey through the world of video games.
                    The idea behind this project is to allow each person to use Statrix in whichever way they prefer: privately and personally, or publicly, sharing their activity and allowing other users to discover them.
                    For example, a user may use Statrix simply to keep track of the games they are playing, create personal lists, and record their experiences without making this information visible to other people. Another user, however, may choose to make some of this information public in order to share it with other players and make it easier for them to find their profile.
                    Both approaches are supported by Statrix, as we believe it is especially important that each user can decide what information they want to share and what information they want to keep private.</p>
                <p className="mt-4 mb-8">This Privacy Policy explains what information we collect, how we use it, where it is stored, and what options users have to manage or delete their data.</p>

                {/* Section 1 */}
                <h2 className="text-2xl text-white font-bold my-4">1. Information We Collect</h2>
                <h3 className="text-xl text-white font-bold my-4">User Information</h3>
                <p>When creating an account on Statrix, we request certain information necessary to provide the service, such as a username, which may be real or fictional, an email address, and a password.
                    Passwords are securely stored using hashing mechanisms and are never stored in plain text, meaning that we cannot retrieve or view the original password. Users can request a password change at any time.
                    Users may optionally provide additional information, such as their city or country, as well as links to external profiles on Twitch, X, or Steam.
                    Currently, Statrix does not allow users to directly upload images or documents to the platform. To customize their profile avatar or banner, users must select one of the predefined options available within the application.</p>

                <h3 className="text-xl text-white font-bold my-4">Video Game-Related Information</h3>
                <p>Statrix may store information related to the user's activity on the platform, such as registered games, lists, ratings, reviews, preferences, and other information related to their activity within the application.</p>
                <p>The visibility of certain information may depend on the privacy settings selected by the user.</p>

                <h3 className="text-xl text-white font-bold my-4">Sessions</h3>
                <p>When a user registers or logs in, Statrix creates and maintains a session that allows the user to be identified while browsing the application and keeps their account authenticated.</p>
                <p>Session information is managed using security mechanisms designed to prevent unauthorized use by third parties.</p>

                <h3 className="text-xl text-white font-bold my-4">Authentication Through Google</h3>
                <p>Statrix allows users to create an account and log in using Google.</p>
                <p>When a user chooses this option, Google may provide Statrix with certain information associated with their Google account, such as their name, email address, profile picture, and user identifier, depending on the permissions granted and the account configuration.</p>
                <p>This information is used to create and manage the user's account and to authenticate the user on Statrix.</p>

                {/* Section 2 */}
                <h2 className="text-2xl text-white font-bold my-4">2. How We Use Your Data</h2>
                <p>The personal information and video game-related information provided by users is primarily used to provide the features of the application, manage user accounts, and enable interactions between users.</p>
                <p>Among other purposes, we use this information to:</p>

                <ul className="list-disc list-inside text-gray-300">
                    <li>Create and manage user accounts.</li>
                    <li>Enable login and authentication.</li>
                    <li>Display information that the user has chosen to make public.</li>
                    <li>Manage games, lists, reviews, and ratings.</li>
                    <li>Provide the platform's social features.</li>
                    <li>Allow users to communicate through the messaging system.</li>
                    <li>Maintain the security and proper functioning of the application.</li>
                </ul>

                <h3 className="text-xl text-white font-bold my-4">Use of Email Addresses</h3>
                <p>The email address is primarily used for account-related purposes, such as sending confirmation emails during registration or allowing users to change or recover their password.
                    We do not use email addresses to send unsolicited commercial communications.</p>

                <h3 className="text-xl text-white font-bold my-4">We Do Not Sell Personal Data</h3>
                <p>Statrix does not sell users' personal data.</p>
                <p>We also do not use users' personal data or information related to their activity on the platform to train artificial intelligence models.</p>
                <p>Statrix does not display advertising or use users' personal data for personalized advertising campaigns.</p>

                {/* Section 3 */}
                <h2 className="text-2xl text-white font-bold my-4">3. Where your data is stored</h2>
                <p>Statrix data is stored in a PostgreSQL database.</p>
                <p>This database contains information necessary for the operation of the application, including user information, video games, lists, reviews, ratings, relationships between users, and conversations.</p>
                <p>The database is hosted on a virtual private server provided by Hostinger, located in Paris, France.</p>
                <p>Data may be processed by service providers involved in the technical operation of Statrix, solely for purposes necessary to provide, maintain, and protect the service.</p>

                {/* Section 4 */}
                <h2 className="text-2xl text-white font-bold my-4">4. User-to-User Chat</h2>
                <p>Statrix allows users to communicate through a messaging system.</p>
                <p>To provide this functionality, we store the content of messages, as well as information associated with them, such as the identifiers of participating users, the conversation room, and the date and time the message was sent.
                    Message content may contain personal information that users voluntarily choose to include in their conversations.</p>
                <p>Access to conversation content is restricted and may occur when necessary for the management, maintenance, or security of the service, or to comply with legal obligations.
                    Users should avoid sharing sensitive personal information or third-party information when they are not authorized to do so.</p>

                {/* Section 5 */}
                <h2 className="text-2xl text-white font-bold my-4">5. How Long We Retain Your Data</h2>
                <p>We retain data while the user maintains an active account and for as long as it is necessary to provide the features of Statrix, unless a legal obligation requires certain data to be retained for a longer period.</p>
                <p>When a user deletes their account, we proceed to delete the personal information, video game-related information, and social data associated with that account, including friendships and conversation data where applicable.</p>
                <p>Data is permanently deleted from Statrix's primary systems. However, backup copies made before the deletion may still exist.</p>
                <p>These backups may be retained for the period necessary for their regular rotation and deletion in accordance with our system maintenance procedures. For this reason, immediate deletion from a specific backup cannot be guaranteed.</p>

                {/* Section 6 */}
                <h2 className="text-2xl text-white font-bold my-4">6. Data Security</h2>
                <p>At Statrix, we work to maintain the security of the platform and protect our users' information against unauthorized access, modification, disclosure, or other unauthorized actions.</p>
                <p>We implement technical and organizational security measures designed to protect data both on the server side and while the application is being used.</p>
                <p>These measures include authentication mechanisms, communication security, and measures designed to restrict access to systems and data to authorized individuals.</p>
                <p>Despite these measures, no system connected to the Internet can guarantee absolute security.</p>

                {/* Section 7 */}
                <h2 className="text-2xl text-white font-bold my-4">7. User Rights</h2>
                <p>Users may exercise the rights granted under applicable data protection laws, including:</p>
                <ul className="list-disc list-inside text-white">
                    <li>The right to access their personal data.</li>
                    <li>The right to correct inaccurate or incomplete data.</li>
                    <li>The right to request the deletion of their data.</li>
                    <li>The right to request restriction of processing.</li>
                    <li>The right to object to processing in certain circumstances.</li>
                    <li>The right to data portability where applicable.</li>
                </ul>
                <p>Users may also withdraw their consent when processing is based on consent.</p>

                {/* Section 8 */}
                <h2 className="text-2xl text-white font-bold my-4">8. Changes to This Privacy Policy</h2>
                <p>Statrix may modify this Privacy Policy when necessary to reflect changes to the operation of the platform, the services we use, or applicable legislation.</p>
                <p>When significant changes are made, users may be notified through the means available on the platform.</p>
            </div>
            <Footer />
        </section>
    )
}