import Footer from '@/components/Footer'
import React from 'react'

export default function TermsPage() {
    return (
        <section className="relative text-gray-300 py-20 w-full">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl text-white font-bold my-4">Terms of use</h1>
                <p className="py-4 text-white">Last update: August 14, 2026</p>

                <p>Statrix is a social platform designed for video game players to keep track of their gaming journey, discover other players with similar interests, and share their experiences with the gaming community.</p>
                <p className="my-4">By creating an account or using Statrix, you agree to comply with these Terms of use. If you do not agree with any of these terms, you should not use the service.</p>
                <p className="mt-4 mb-8">These Terms of use apply to all users of Statrix, including registered users and visitors.</p>

                {/* Section 1 */}
                <h2 className="text-2xl text-white font-bold my-4">1. Using Statrix</h2>
                <p>Statrix is intended for personal and lawful use.</p>
                <p>You agree to use the platform responsibly and in accordance with these Terms of use, applicable laws, and the rights of other users.</p>

                <p>You must not use Statrix to:</p>
                <ul className="list-disc list-inside my-4">
                    <li>Break any applicable law or regulation.</li>
                    <li>Impersonate another person or entity.</li>
                    <li>Attempt to gain unauthorized access to another user's account.</li>
                    <li>Interfere with or disrupt the operation of the platform.</li>
                    <li>Attempt to access, modify, or damage Statrix's systems or databases without authorization.</li>
                    <li>Use automated systems, bots, scrapers, or similar tools to collect information from the platform without our permission.</li>
                    <li>Distribute malware, viruses, or other malicious software.</li>
                    <li>Use the platform to harass, threaten, abuse, or deliberately harm other users.</li>
                    <li>Use Statrix to distribute spam or unsolicited commercial content.</li>
                    <li>Attempt to circumvent security measures or restrictions implemented by Statrix.</li>
                </ul>
                <p>We reserve the right to take appropriate action when these rules are violated.</p>

                {/* Section 2 */}
                <h2 className="text-2xl text-white font-bold my-4">2. User accounts</h2>
                <p>Some features of Statrix require the creation of an account.</p>
                <p>When creating an account, you agree to provide accurate information and to keep your account information reasonably up to date.</p>
                <p>You are responsible for keeping your login credentials secure and for all activity performed through your account.</p>
                <p>You must not share your password or knowingly allow another person to access your account.</p>
                <p>If you believe that your account has been compromised or accessed without authorization, you should contact us as soon as possible.</p>
                <p>We reserve the right to suspend or terminate accounts that violate these Terms of use or that are involved in fraudulent, abusive, or harmful activity.</p>

                {/* Section 3 */}
                <h2 className="text-2xl text-white font-bold my-4">3. User generated content</h2>
                <p>Statrix allows users to create and share content, including but not limited to:</p>
                <ul className="list-disc list-inside">
                    <li>Reviews.</li>
                    <li>Ratings.</li>
                    <li>Lists.</li>
                    <li>User profiles.</li>
                    <li>Comments or other social interactions.</li>
                    <li>Messages sent through the chat system.</li>
                </ul>

                <p className="py-4">You remain responsible for the content you create and submit to Statrix.</p>
                <p>By submitting content to Statrix, you confirm that:</p>
                <ul className="list-disc list-inside">
                    <li>You have the necessary rights to submit the content.</li>
                    <li>The content does not knowingly violate the rights of another person or entity.</li>
                    <li>The content does not contain unlawful, fraudulent, or malicious material.</li>
                    <li>The content complies with these Terms of use.</li>
                </ul>
                <p className="py-4">You should not publish personal information belonging to another person without appropriate authorization.</p>


                {/* Section 4 */}
                <h2 className="text-2xl text-white font-bold my-4">4. Public and private information</h2>
                <p>Statrix allows users to control which parts of their profile and activity are visible to other users, where such privacy options are available.</p>
                <p>Information that you choose to make public may be visible to other Statrix users and, depending on the functionality of the platform, may potentially be accessible through publicly available pages.</p>
                <p>You are responsible for deciding what information you choose to make public.</p>
                <p>We recommend that users avoid publishing sensitive personal information or information that could compromise their privacy or security.</p>

                {/* Section 5 */}
                <h2 className="text-2xl text-white font-bold my-4">5. Messaging</h2>
                <p>Statrix provides a messaging system that allows users to communicate with one another.</p>
                <p>Users are responsible for the content of the messages they send.</p>
                <p>The messaging system must not be used to:</p>
                <ul className="list-disc list-inside">
                    <li>Harass or threaten other users.</li>
                    <li>Send spam or unsolicited commercial messages.</li>
                    <li>Distribute malicious content.</li>
                    <li>Share unlawful content.</li>
                    <li>Attempt to obtain another person's passwords, credentials, or other sensitive information.</li>
                    <li>Engage in fraudulent or abusive activities.</li>
                </ul>
                <p className="py-4">We reserve the right to take action against accounts that misuse the messaging system.</p>
                <p>Information regarding how messages and other personal data are processed can be found in our Privacy Policy.</p>

                {/* Section 6 */}
                <h2 className="text-2xl text-white font-bold my-4">6. Reviews, Ratings, and Gaming Information</h2>
                <p>Statrix allows users to record their experiences with video games, including ratings, reviews, lists, and other gaming-related information.</p>
                <p>Users are responsible for ensuring that their reviews and other contributions represent their genuine opinions and experiences.</p>
                <p>Reviews must not be used to:</p>
                <ul className="list-disc list-inside">
                    <li>Deliberately mislead other users.</li>
                    <li>Harass or target individuals.</li>
                    <li>Promote illegal activities.</li>
                    <li>Spam or advertise unrelated products or services.</li>
                    <li>Include content that violates the rights of others.</li>
                </ul>
                <p className="py-4">Statrix reserves the right to remove content that violates these Terms of use or that is otherwise harmful to the community.</p>

                {/* Section 7 */}
                <h2 className="text-2xl text-white font-bold my-4">7. Moderation and removal of content</h2>
                <p>Statrix may review or moderate content when necessary to maintain the security, functionality, and integrity of the platform.</p>
                <p>We may remove or restrict access to content that:</p>
                <ul className="list-disc list-inside">
                    <li>Violates these Terms of use.</li>
                    <li>Violates applicable laws.</li>
                    <li>Threatens the security or operation of the platform.</li>
                    <li>Harms or threatens other users.</li>
                    <li>Is reported by users and determined to violate these Terms.</li>
                </ul>
                <p className="py-4">Where appropriate, we may also suspend or terminate accounts associated with serious or repeated violations.</p>
                <p>We do not guarantee that all inappropriate content will be detected or removed immediately.</p>

                {/* Section 8 */}
                <h2 className="text-2xl text-white font-bold my-4">8. Intellectual property</h2>
                <p>The Statrix platform, including its software, design, branding, logos, interface, and original content created by Statrix, is protected by applicable intellectual property laws.</p>
                <p>Unless otherwise stated, these materials belong to Statrix or are used under appropriate authorization.</p>
                <p>You may not copy, reproduce, modify, distribute, sell, or commercially exploit Statrix's proprietary materials without prior authorization.</p>
                <h3 className="text-xl text-white font-bold my-4">User Content</h3>
                <p>You retain ownership of the content you create and submit to Statrix.</p>
                <p>By submitting content to the platform, you grant Statrix a non-exclusive, worldwide, royalty-free license to store, reproduce, display, and process that content to the extent necessary to operate, maintain, and provide the features of the service.</p>
                <p>This license exists only for the purposes necessary to operate Statrix and does not transfer ownership of your content to Statrix.</p>
            
                {/* Section 9 */}
                <h2 className="text-2xl text-white font-bold my-4">9. Third-Party services</h2>
                <p>Statrix may rely on third-party services to provide certain functionalities, such as authentication, hosting, email delivery, or other technical services.</p>
                <p>These services may have their own terms and privacy policies.</p>
                <p>Your use of Statrix may therefore also be subject to the terms and policies of those third-party providers where applicable.</p>
                <p>Further information about how third-party services may process personal data can be found in our Privacy Policy.</p>

                    
                {/* Section 10 */}
                <h2 className="text-2xl text-white font-bold my-4">10. Availability of the service</h2>
                <p>We aim to keep Statrix available and functioning properly, but we cannot guarantee that the platform will always be available, uninterrupted, or error-free.</p>
                <p>The service may occasionally be unavailable due to:</p>
                <ul className="list-disc list-inside">
                    <li>Maintenance.</li>
                    <li>Software updates.</li>
                    <li>Technical problems.</li>
                    <li>Security incidents.</li>
                    <li>Infrastructure failures.</li>
                    <li>Circumstances outside our reasonable control.</li>
                </ul>
                <p className="py-4">We may also modify, suspend, or discontinue certain features of Statrix when necessary.</p>

                {/* Section 11 */}
                <h2 className="text-2xl text-white font-bold my-4">11. Account deletion</h2>
                <p>You may request or initiate the deletion of your Statrix account using the available account management functionality.</p>
                <p>When an account is deleted, the personal information and other data associated with the account will be handled in accordance with our Privacy Policy.</p>
                <p>Some information may need to be retained for a limited period when required by law or when necessary for legitimate legal or security purposes.</p>

                {/* Section 12 */}
                <h2 className="text-2xl text-white font-bold my-4">12. Suspension and termination</h2>
                <p>We may suspend or terminate an account when we reasonably believe that the user has:</p>
                <ul className="list-disc list-inside">
                    <li>Seriously or repeatedly violated these Terms of use.</li>
                    <li>Attempted to compromise the security of Statrix.</li>
                    <li>Engaged in fraudulent or abusive behavior.</li>
                    <li>Used the platform for illegal purposes.</li>
                    <li>Seriously harmed other users or the operation of the platform.</li>
                </ul>
                <p>Where appropriate, we may provide the user with an opportunity to resolve the issue before permanently terminating an account.</p>
                <p>In cases involving serious security risks, illegal activity, or immediate harm to other users or the platform, action may be taken without prior notice.</p>

                
                {/* Section 13 */}
                <h2 className="text-2xl text-white font-bold my-4">13. Disclaimer</h2>
                <p>Statrix is provided on an "as is" and "as available" basis.</p>
                <p>While we make reasonable efforts to maintain the platform and provide accurate information, we do not guarantee that:</p>
                <ul className="list-disc list-inside">
                    <li>The service will always be available.</li>
                    <li>The platform will always operate without errors.</li>
                    <li>All information displayed on the platform will always be accurate or complete.</li>
                    <li>User-generated content will always be appropriate, accurate, or reliable.</li>
                    <li>Data will never be lost due to technical failures or circumstances beyond our reasonable control.</li>
                </ul>
                <p className="py-4">Users are responsible for maintaining their own appropriate backups of information they consider important.</p>

                {/* Section 14 */}
                <h2 className="text-2xl text-white font-bold my-4">14. Limitation of liability</h2>
                <p>To the extent permitted by applicable law, Statrix will not be responsible for indirect or consequential damages arising from the use of the platform, including losses resulting from service interruptions, technical failures, unauthorized access, or user-generated content.</p>
                <p>Nothing in these Terms of use is intended to exclude or limit liability where such exclusion or limitation is not permitted under applicable law.</p>

                {/* Section 15 */}
                <h2 className="text-2xl text-white font-bold my-4">15. Changes to these terms</h2>
                <p>We may update these Terms of use when necessary to reflect changes to Statrix, the services we provide, or applicable legislation.</p>
                <p>When significant changes are made, we may notify users through the platform or other appropriate means.</p>
                <p>Continued use of Statrix after the updated Terms of use become effective means that you accept the revised terms.</p>

                {/* Section 16 */}
                <h2 className="text-2xl text-white font-bold my-4">16. Applicable law</h2>
                <p>These Terms of use are governed by the applicable laws of Spain, unless mandatory applicable law provides otherwise.</p>
                <p>Any disputes arising from the use of Statrix will be subject to the competent courts in accordance with applicable law.</p>

                {/* Section 17 */}
                <h2 className="text-2xl text-white font-bold my-4">17. Contact</h2>
                <p>If you have questions regarding these Terms of use, the operation of Statrix, or your account, you can contact us at:</p>
                <p className="py-2 text-white">contact@statrix.com</p>
            </div>
            <Footer />
        </section>
    )
}