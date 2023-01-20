-- Test Cultures

INSERT INTO culture (code,name,lang) 
VALUES ('A000','Default Culture','en-us');

INSERT INTO culture (code,name,lang)
VALUES ('Z900','Test Culture 1','en-us');

INSERT INTO culture (code,name,lang)
VALUES ('Z901','Test Culture 2','en-us');

-- Defaults

INSERT INTO question_set (code,name)
VALUES ('A000','Computer Science Principles Basics');

INSERT INTO teacher (username, first_name, last_name, email, password)
VALUES ('TEACHER#ONE', 'Teacher', 'One', 'lt@atcsed', 'teacher123');

INSERT INTO classroom (teacher_id,question_set_code,name)
VALUES (1,'A000','Original Teacher#One Classroom');

-- Question Set Culture

INSERT INTO question_set_culture (culture_code,question_set_code,description,isdefault)
VALUES ('A000','A000','Default QuestionSetCulture',TRUE);

INSERT INTO question_set_culture (culture_code,question_set_code,description,isdefault)
VALUES ('Z900','A000','Test QuestionSetCulture 1',TRUE);

INSERT INTO question_set_culture (culture_code,question_set_code,description,isdefault)
VALUES ('Z901','A000','Test QuestionSetCulture 2',TRUE);

-- These add in the first set of metaquestions

INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','1C01','Select and operate appropriate software to perform a variety of tasks, and recognize that users have different needs and preferences for the technology they use.[1A-CS-01]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','1C02','Use appropriate terminology in identifying and describing the function of common physical components of computing systems (hardware).[1A-CS-02]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','1C03','Describe basic hardware and software problems using accurate terminology.[1A-CS-03]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','1N04','Explain what passwords are and why we use them, and use strong passwords to protect devices and information from unauthorized access.[1A-NI-04]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','1D05','Store, copy, search, retrieve, modify, and delete information using a computing device and define the information stored as data.[1A-DA-05]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','1D06','Collect and present the same data in various visual formats.[1A-DA-06]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','1D07','Identify and describe patterns in data visualizations, such as charts or graphs, to make predictions.[1A-DA-07]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','1A08','Model daily processes by creating and following algorithms (sets of step-by-step instructions) to complete tasks.[1A-AP-08]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','1A09','Model the way programs store and manipulate data by using numbers or other symbols to represent information.[1A-AP-09]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','1A10','Develop programs with sequences and simple loops, to express ideas or address a problem.[1A-AP-10]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','1A11','Decompose (break down) the steps needed to solve a problem into a precise sequence of instructions.[1A-AP-11]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','1A12','Develop plans that describe a programs sequence of events, goals, and expected outcomes.[1A-AP-12]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','1A13','Give attribution when using the ideas and creations of others while developing programs.[1A-AP-13]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','1A14','Debug (identify and fix) errors in an algorithm or program that includes sequences and simple loops.[1A-AP-14]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','1A15','Using correct terminology, describe steps taken and choices made during the iterative process of program development.[1A-AP-15]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','1I16','Compare how people live and work before and after the implementation or adoption of new computing technology.[1A-IC-16]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','1I17','Work respectfully and responsibly with others online.[1A-IC-17]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','1I18','Keep login information private, and log off of devices appropriately.[1A-IC-18]');

INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','2C01','Describe how internal and external parts of computing devices function to form a system[1B-CS-01]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','2C02','Model how computer hardware and software work together as a system to accomplish tasks.[1B-CS-02]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','2C03','Determine potential solutions to solve simple hardware and software problems using common troubleshooting strategies[1B-CS-03]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','2N04','Model how information is broken down into smaller pieces, transmitted as packets through multiple devices over networks and the Internet, and reassembled at the destination.[1B-NI-04]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','2N05','Discuss real-world cybersecurity problems and how personal information can be protected.[1B-NI-05]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','2D06','Organize and present collected data visually to highlight relationships and support a claim.[1B-DA-06]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','2D07','Use data to highlight or propose cause-and-effect relationships, predict outcomes, or communicate an idea.[1B-DA-07]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','2A08','Compare and refine multiple algorithms for the same task and determine which is the most appropriate.[1B-AP-08]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','2A09','Create programs that use variables to store and modify data.[1B-AP-09]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','2A10','Create programs that include sequences, events, loops, and conditionals.[1B-AP-10]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','2A11','Decompose (break down) the steps needed to solve a problem into a precise sequence of instructions.[1B-AP-11]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','2A12','Modify, remix, or incorporate portions of an existing program into one''s own work, to develop something new or add more advanced features[1B-AP-12]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','2A13','Use an iterative process to plan the development of a program by including others'' perspectives and considering user preferences.[1B-AP-13]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','2A14','Observe intellectual property rights and give appropriate attribution when creating or remixing programs.[1B-AP-14]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','2A15','Test and debug (identify and fix errors) a program or algorithm to ensure it runs as intended.[1B-AP-15]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','2A16','Take on varying roles, with teacher guidance, when collaborating with peers during the design, implementation, and review stages of program development.[1B-AP-16]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','2A17','Describe choices made during program development using code comments, presentations, and demonstrations.[1B-AP-17]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','2I18','Discuss computing technologies that have changed the world, and express how those technologies influence, and are influenced by, cultural practices.[1B-IC-18]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','2I19','Brainstorm ways to improve the accessibility and usability of technology products for the diverse needs and wants of users.[1B-IC-19]');

INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','3C01','Recommend improvements to the design of computing devices, based on an analysis of how users interact with the devices.[2-CS-01]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','3C02','Design projects that combine hardware and software components to collect and exchange data.[2-CS-02]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','3C03','Systematically identify and fix problems with computing devices and their components.[2-CS-03]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','3N04','Model the role of protocols in transmitting data across networks and the Internet.[2-NI-04]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','3N05','Explain how physical and digital security measures protect electronic information.[2-NI-05]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','3N06','Apply multiple methods of encryption to model the secure transmission of information.[2-NI-06]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','3D07','Represent data using multiple encoding schemes.[2-DA-07]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','3D08','Collect data using computational tools and transform the data to make it more useful and reliable.[2-DA-08]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','3D09','Refine computational models based on the data they have generated.[2-DA-09]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','3A10','Use flowcharts and/or pseudocode to address complex problems as algorithms.[2-AP-10]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','3A11','Create clearly named variables that represent different data types and perform operations on their values.[2-AP-11]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','3A12','Design and iteratively develop programs that combine control structures, including nested loops and compound conditionals.[2-AP-12]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','3A13','Decompose problems and subproblems into parts to facilitate the design, implementation, and review of programs.[2-AP-13]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','3A14','Create procedures with parameters to organize code and make it easier to reuse.[2-AP-14]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','3A15','Seek and incorporate feedback from team members and users to refine a solution that meets user needs.[2-AP-15]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','3A16','Incorporate existing code, media, and libraries into original programs, and give attribution.[2-AP-16]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','3A17','Systematically test and refine programs using a range of test cases.[2-AP-17]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','3A18','Distribute tasks and maintain a project timeline when collaboratively developing computational artifacts.[2-AP-18]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','3A19','Document programs in order to make them easier to follow, test, and debug.[2-AP-19]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','3I20','Compare tradeoffs associated with computing technologies that affect peoples everyday activities and career options.[2-IC-20]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','3I21','Discuss issues of bias and accessibility in the design of existing technologies.[2-IC-21]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','3I22','Collaborate with many contributors through strategies such as crowdsourcing or surveys when creating a computational artifact.[2-IC-22]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','3I23','Describe tradeoffs between allowing information to be public and keeping information private and secure.[2-IC-23]');

INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','4C01','Explain how abstractions hide the underlying implementation details of computing systems embedded in everyday objects[3A-CS-01]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','4C02','Compare levels of abstraction and interactions between application software, system software, and hardware layers.[3A-CS-02]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','4C03','Develop guidelines that convey systematic troubleshooting strategies that others can use to identify and fix errors.[3A-CS-03]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','4N04','Evaluate the scalability and reliability of networks, by describing the relationship between routers, switches, servers, topology, and addressing.[3A-NI-04]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','4N05','Give examples to illustrate how sensitive data can be affected by malware and other attacks.[3A-NI-05]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','4N06','Recommend security measures to address various scenarios based on factors such as efficiency, feasibility, and ethical impacts.[3A-NI-06]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','4N07','Compare various security measures, considering tradeoffs between the usability and security of a computing system.[3A-NI-07]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','4N08','Explain tradeoffs when selecting and implementing cybersecurity recommendations.[3A-NI-08]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','4D09','Translate between different bit representations of real-world phenomena, such as characters, numbers, and images.[3A-DA-09]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','4D10','Evaluate the tradeoffs in how data elements are organized and where data is stored.[3A-DA-10]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','4D11','Create interactive data visualizations using software tools to help others better understand real-world phenomena.[3A-DA-11]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','4D12','Create computational models that represent the relationships among different elements of data collected from a phenomenon or process.[3A-DA-12]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','4A13','Create prototypes that use algorithms to solve computational problems by leveraging prior student knowledge and personal interests.[3A-AP-13]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','4A14','Use lists to simplify solutions, generalizing computational problems instead of repeatedly using simple variables.[3A-AP-14]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','4A15','Justify the selection of specific control structures when tradeoffs involve implementation, readability, and program performance, and explain the benefits and drawbacks of choices made.[3A-AP-15]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','4A16','Design and iteratively develop computational artifacts for practical intent, personal expression, or to address a societal issue by using events to initiate instructions.[3A-AP-16]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','4A17','Decompose problems into smaller components through systematic analysis, using constructs such as procedures, modules, and/or objects.[3A-AP-17]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','4A18','Create artifacts by using procedures within a program, combinations of data and procedures, or independent but interrelated programs.[3A-AP-18]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','4A19','Systematically design and develop programs for broad audiences by incorporating feedback from users.[3A-AP-19]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','4A20','Evaluate licenses that limit or restrict use of computational artifacts when using resources such as libraries [3A-AP-20]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','4A21','Evaluate and refine computational artifacts to make them more usable and accessible.[3A-AP-21]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','4A22','Design and develop computational artifacts working in team roles using collaborative tools.[3A-AP-22]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','4A23','Document design decisions using text, graphics, presentations, and/or demonstrations in the development of complex programs.[3A-AP-23]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','4I24','Evaluate the ways computing impacts personal, ethical, social, economic, and cultural practices.[3A-IC-24]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','4I25','Test and refine computational artifacts to reduce bias and equity deficits.[3A-IC-25]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','4I26','Demonstrate ways a given algorithm applies to problems across disciplines.[3A-IC-26]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','4I27','Use tools and methods for collaboration on a project to increase connectivity of people in different cultures and career fields.[3A-IC-27]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','4I28','Explain the beneficial and harmful effects that intellectual property laws can have on innovation.[3A-IC-28]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','4I29','Explain the privacy concerns related to the collection and generation of data through automated processes that may not be evident to users.[3A-IC-29]');
INSERT INTO meta_question (question_set_code,code,description) VALUES ('A000','4I30','Evaluate the social and economic implications of privacy in the context of safety, law, or ethics.[3A-IC-30]');










