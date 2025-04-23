Project Description:

Simple Evaluation is a product dedicated to simplify performance evaluations, oriented for businesses of all sizes, it makes it easy for small business without a development team internally to leverage the capabilities and customization options offered by Simple Evaluation.

Product Characteristics:

- Fully customizable questions.
- Ability to create job functions.
- Relational capabilities between questions and job functions, in other words questions are assigned to job functions.
- Dynamic reward model, the reward can be assigned based on job function to be a fixed amount divided by the total number of questions assigned to the job function or based on a fixed reward number attached to each individual question.
- SMART measuring for evaluation criteria can be applied, but admins can customize the levels and percentages that will apply, for example it can be Green (100%), Yellow (50%), or Red(0%), or Always does, Sometimes Does, Needs Improving, or other categories and percentages can be used as well.
- Customizable approval flow
- Email notifications
- Document generation with the final results of evaluations to enable transparency with employees.
- Approvers can choose to reject or make changes to the evaluation before approving, and evaluators will be informed of the exact changes made by the approver.
- Multiple level of approvers can be defined, for example, supervisor, manager, VP, finance, up to 5 levels.
- Mobile-first approach, the web app can be accessed on all screen sizes.
- Easy setup of the organization/team by uploading employee data using excel file uploads.
- User-friendly interface

Technical Implementation Details

We are going to use the following tech stack to create this web app:

- TypeScript
- Node.js
- Stripe
- React
- Next.js (App Router)
- Tailwind CSS
- ShadCN UI
- Firebase (Auth, Firestore, Storage)

User Stories/Journeys:

The user will be welcomed with a landing page with headlines and CTAs prompting to try the product, although the product requires a subscription we will offer 14-days-trial.

The registration process will ask the user for full name, company name, company email, password, and then the number of seats, the number of seats will have the same cost for admins, evaluators or approvers alike, they just need to define the number of seats, we will offer a month-to-month payment, or a Yearly payment with a 20% discount.

Once the user completes the registration process they can then proceed to create their team or organization, where they can download a csv or xlsx template to fill out with employee data to setup their organization details to prepare for the evaluations, the fields for this will be full name, email address (if available), phone number (optional), role, supervisor.

Then the user will be able to start creating the job functions, the Job Functions will only need Name, ID (which can be automatically created), and manager (optional).

Lastly the user will be prompted to create the questions and link them to the previously created Job Functions.

Finally in the calendar section of the app they will be able to schedule the time frames or date ranges when evaluations are required to start being completed.

In the user management section is the place where the seats purchased by the user will be reflected, as well as the seats in use and remaining, here the user/admin will be able to add the evaluators and approvers as well as other admins, the roles are defined as follows:

- Admin: Access to all the configurations available in the app, for example creating questions, adding users to the user management section, adding job functions, deleting job functions, deleting questions, setting up schedules for evaluations, and so on.
- Evaluator: Access to evaluations due to him based on the team/organization structure previously defined, in other words he or she will have pending evaluations based on the number of employees for which he shows as supervisor, once submitted the evaluator role will have access to view their submitted evaluations and monitor the status, although once submitted they can only edit if the evaluation is rejected by one of the approvers.
- Approver: These can also be evaluators but they will have access to evaluations submitted by evaluators where their name is in one of the approvers, they will be able to approve, reject and even modify the evaluation as they see fit, however once approved and moved to the next approver level, they can’t change it anymore.

The admins can always access analytics page where they can see historical data, trends and patterns of their performance evaluation process, the app will also have AI analysis built in, that will produce recommendations, admins can share via email these analytics with leadership.

For evaluators, once a evaluation has been scheduled by admins they will receive emails letting them know the number of evaluations they have pending to submit on a daily basis during the period of the scheduled defined.

Evaluators can also start evaluations and save them as draft to finalize later to then submit.