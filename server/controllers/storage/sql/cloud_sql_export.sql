--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.24
-- Dumped by pg_dump version 9.6.24

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
-- SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: blogpost; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blogpost (
    id uuid NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    markdown text NOT NULL,
    created_on timestamp with time zone NOT NULL,
    saved_on timestamp with time zone,
    published_on timestamp with time zone,
    revised_on timestamp with time zone
);


--
-- Name: blogpostasset; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blogpostasset (
    post_id uuid NOT NULL,
    name text NOT NULL,
    url text NOT NULL
);


--
-- Name: course; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.course (
    id uuid NOT NULL,
    author_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    master_pvc_name text NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone,
    published_at timestamp with time zone,
    revised_at timestamp with time zone
);


--
-- Name: lesson; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lesson (
    id uuid NOT NULL,
    course_id uuid NOT NULL,
    title text NOT NULL,
    mdx text NOT NULL,
    "position" smallint NOT NULL,
    folder_name text,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone
);


--
-- Name: lessonasset; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lessonasset (
    lesson_id uuid NOT NULL,
    name text NOT NULL,
    url text NOT NULL
);


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version bigint NOT NULL,
    dirty boolean NOT NULL
);


--
-- Name: user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."user" (
    id uuid NOT NULL,
    username text NOT NULL,
    email text NOT NULL,
    first_name text,
    last_name text,
    stripe_customer_token text,
    instance_password text
);


--
-- Data for Name: blogpost; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.blogpost (id, title, slug, markdown, created_on, saved_on, published_on, revised_on) FROM stdin;
524e5181-2a5a-44c0-bce7-436cdf865207	Maybe I Can Finally Write	maybe-i-can-finally-write	# Maybe I Can Finally Write\n\nI have had the desire to share my thoughts with a greater audience for a long time. \n\nI've been journaling since April 2014, so I've become comfortable with writing words for personal introspection. But I often think of those words as *not good enough* for public consumption. Part of my hesitation with creating a blog is the inherent vulnerability of sharing my thoughts with the Internet-at-large. \n\nI’m a firm believer in owning ones’ content, and building this site was motivated in large part by that belief.  Instead of trying to figure out Wordpress (or worse, give in to the convenience of a platform like Medium) I decided to write myself a **blog engine** before writing *blog posts*. \n\nI first had the idea in 2015, but finding the motivation to work so diligently on a personal project never seemed to come. Four years later, after learning a new programming language and several Javascript frameworks, I've completed a long-standing personal desire. For those who like tech buzzwords, this site lives *in the cloud* on an EC2 instance, as a small React application with a back-end written in Go. All this is wrapped up in a Docker image to streamline deployments. \n\nI do plan on writing up a longer-form article to describe the implementation. But for now, after so much deliberation and time spent, I can safely mark this off my checklist: \n\n- ✅ ~~Create blog~~\n \n\nAnd so maybe I can finally write. 	2020-09-24 23:24:40.695459+00	\N	2019-04-28 05:28:22.597+00	\N
1a4d205e-bbf2-4192-b64a-27da64c45171	Lorem Ipsum Lesson	lorem-ipsum-lesson	# Lorem Ipsum Lesson\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas elementum, lorem eu consequat porttitor, nisi dui rutrum tellus, quis pellentesque ipsum nunc non sem. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sed quam sollicitudin, efficitur nisl vel, accumsan ex. Nulla nec augue massa. Nam id justo iaculis, fringilla elit hendrerit, molestie orci. Ut id augue sit amet quam ultrices mollis. Curabitur maximus orci vel dui varius congue. Sed gravida, risus quis finibus varius, arcu lectus pretium orci, nec consectetur leo dolor sed est. Ut elementum leo vel efficitur auctor. Duis consectetur velit quis orci rhoncus, non dapibus nibh malesuada. Morbi molestie rhoncus ornare. Duis pellentesque mauris massa, vel condimentum odio condimentum convallis. Nulla sed malesuada nisl.\n\n```go\npackage main\n\nimport "fmt"\n\nfunc main() {\n\n    s := make([]string, 3)\n    fmt.Println("emp:", s)\n\n    s[0] = "a"\n    s[1] = "b"\n    s[2] = "c"\n    fmt.Println("set:", s)\n    fmt.Println("get:", s[2])\n\n    fmt.Println("len:", len(s))\n\n    s = append(s, "d")\n    s = append(s, "e", "f")\n    fmt.Println("apd:", s)\n\n    c := make([]string, len(s))\n    copy(c, s)\n    fmt.Println("cpy:", c)\n\n    l := s[2:5]\n    fmt.Println("sl1:", l)\n\n    l = s[:5]\n    fmt.Println("sl2:", l)\n\n    l = s[2:]\n    fmt.Println("sl3:", l)\n\n    t := []string{"g", "h", "i"}\n    fmt.Println("dcl:", t)\n\n    twoD := make([][]int, 3)\n    for i := 0; i < 3; i++ {\n        innerLen := i + 1\n        twoD[i] = make([]int, innerLen)\n        for j := 0; j < innerLen; j++ {\n            twoD[i][j] = i + j\n        }\n    }\n    fmt.Println("2d: ", twoD)\n}\n```\n\nCras pharetra sem id leo malesuada, tincidunt iaculis ipsum consectetur. Proin interdum, tortor ac tincidunt volutpat, ex ante sagittis lorem, eget iaculis enim erat ac mi. Vestibulum eget commodo nibh, dapibus elementum ex. Aenean odio est, semper vel ipsum sed, pretium convallis elit. Aliquam elementum faucibus turpis. Nulla a placerat erat. Nunc posuere leo ipsum, at sagittis nibh consequat quis. Aenean vitae turpis massa.\n\n```sh\n$ virtctl expose virtualmachine vmi-ephemeral --name vmiservice --port 27017 --target-port 22\n```\n\nNam et venenatis augue. Donec laoreet sagittis imperdiet. Proin lectus ante, finibus eget euismod quis, iaculis in nibh. Vestibulum vel urna eros. Aliquam auctor accumsan mi ullamcorper suscipit. Mauris ullamcorper venenatis feugiat. Mauris ipsum turpis, fermentum quis viverra sit amet, finibus eu turpis. Proin cursus nisl ex, eu sagittis sapien ornare non. Curabitur vitae nibh vel elit facilisis condimentum nec id diam. Donec maximus in justo non ultrices. In mollis arcu ut nibh aliquet, et sollicitudin turpis volutpat. Integer dapibus libero nec sem mattis sodales. Quisque a est fringilla, pharetra augue sed, rutrum diam.\n\nSuspendisse iaculis leo maximus massa elementum convallis. Donec non orci molestie nunc tempus varius id nec felis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce quis commodo urna. Vestibulum nec tempus risus, in blandit lacus. Suspendisse a orci hendrerit, auctor purus vitae, iaculis neque. Nam sed ipsum eget libero malesuada tempus. Mauris eros magna, blandit non dignissim vitae, consequat interdum nibh. Integer dapibus, dui ac feugiat egestas, eros nibh consequat nisl, sed euismod metus purus ac eros. Nullam lorem elit, semper sit amet congue laoreet, cursus a purus. Mauris consequat tortor vel velit gravida vehicula. Duis dapibus bibendum lorem eu eleifend. Nullam fringilla lacinia est eu congue. Ut bibendum elementum aliquet. Pellentesque imperdiet sit amet turpis maximus egestas. Mauris fermentum quam aliquam sodales porta.\n\nNullam tempus ligula vitae libero pellentesque, at maximus ligula varius. Nam aliquet nec ipsum vitae fringilla. Duis vitae suscipit ante, sit amet dictum ante. Fusce pharetra velit tellus, ut gravida risus vestibulum in. In non neque eros. Aenean tincidunt sit amet dolor ac pharetra. Aenean rhoncus eros vitae lectus mattis, et rhoncus nisi congue.\n\nNam ut mauris eget risus dapibus viverra. Sed a dictum eros, eget venenatis leo. Donec vulputate velit lectus, vitae laoreet odio fermentum sed. Vestibulum blandit mattis orci, vitae gravida neque tempor in. Duis eu elit in nisl feugiat facilisis eget id velit. Nullam interdum convallis justo, eget blandit ante feugiat vitae. Aenean turpis quam, tempus quis faucibus vitae, hendrerit euismod eros. Interdum et malesuada fames ac ante ipsum primis in faucibus.\n\nMauris eget elit nunc. Maecenas rhoncus mauris non ipsum vestibulum auctor. Curabitur sed lacus sem. Morbi cursus, felis quis blandit malesuada, justo ex bibendum sem, et elementum ante tortor sed dolor. Nulla aliquet ornare arcu. Morbi ac nulla sit amet nisi luctus consequat at at lacus. Donec vulputate placerat tellus. Cras finibus sem ut arcu feugiat, a iaculis tortor laoreet. Donec venenatis dolor quis placerat tristique. Pellentesque sed cursus urna. Donec aliquam urna id mauris varius imperdiet. Vivamus imperdiet tristique justo.\n\nAenean eu faucibus ante. Aliquam sed consequat felis. Vivamus dictum nulla vel nulla volutpat, in lobortis neque feugiat. Sed consectetur dui nisi. Aliquam non risus ut ante molestie malesuada facilisis vel tellus. Integer et purus eu elit venenatis pretium. Phasellus ullamcorper vel odio at bibendum. Mauris placerat mi a nibh scelerisque, nec semper lorem vehicula. Donec sollicitudin accumsan nisl. Mauris vitae pretium purus. Nunc sit amet diam ut neque tempor fermentum eget ac leo. Sed ornare mauris ac varius dapibus. Vivamus tempus porttitor lorem, sit amet vestibulum tortor mollis at.\n\nDonec a ipsum vitae lectus ultricies pulvinar. Maecenas pharetra risus sit amet rutrum volutpat. Proin urna justo, vestibulum et odio dapibus, fermentum pellentesque purus. Praesent bibendum volutpat scelerisque. Aliquam nisl magna, commodo eget aliquet at, accumsan non turpis. Vivamus egestas suscipit dolor vitae varius. Maecenas sed maximus nibh.\n\nAliquam blandit dictum lacinia. Praesent ac fermentum magna. Nullam varius suscipit lacinia. Praesent ultricies purus erat, non cursus arcu consectetur vel. Ut luctus porta nunc. Vestibulum sit amet arcu iaculis, sodales lectus quis, pulvinar sapien. Duis consequat tellus magna, non consectetur elit luctus ac. Nunc pulvinar bibendum tortor, sed laoreet felis viverra id. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed aliquet lorem eget pellentesque feugiat. Praesent quis ligula mi. Suspendisse potenti. Aliquam auctor lorem vitae odio finibus, sed finibus sapien vulputate.	2020-10-15 19:20:59.141013+00	2020-10-15 19:21:10.590507+00	\N	\N
c76afac7-533e-486e-aed7-4c46adba9f81	Stream 0	stream-0	# Stream 0\n\n![3D rendering of reflective metal tubes against a black background](https://storage.googleapis.com/download/storage/v1/b/medhir-com/o/blog%2Fassets%2Fc76afac7-533e-486e-aed7-4c46adba9f81%2Fb5cb2dde-b2ce-4918-80b8-2e35fc847aeb.jpg?generation=1601414204849358&alt=media)\n\nI’ve been quiet on this blog for the past few months. I often struggle with finding the right words, to hit a poignant note that meets whatever “standards” I have to publish something. \n\nBut the only way I’ll improve / become more comfortable with my online-self is to write, and to make that writing public. So I’m starting what will hopefully become a collection of posts where I just share a bit about what’s going on, a low-stakes stream of consciousness that gets my creative juices flowing. \n\nFor the first time in my life, I’m genuinely motivated and happy about the work I’m doing. It’s not every day one gets to have great co-workers, a strong sense of personal contribution in the day-to-day, and clear opportunities for growth. I feel incredibly lucky to have landed where I am now, but am also acutely aware that this isn’t the case for a wide swath of people in the industry. \n\nPersonally, the past few years have been a rough professionally. I struggled with the feeling that my work wasn’t valued, that no one cared to see my skills improve over time. Being noticed was difficult, and trying to advance myself to better opportunities was rife with questionable interview processes. While thankfully this is no longer the case, I wonder how many other people go through similar issues. It’s incredibly easy to question your self worth when external forces reject you, when you freeze up trying to figure out a solution to a random data structure / algorithm problem. \n\nI’ve come to the conclusion (after interviewing at big-name gigs and startups alike) that most tech companies optimize for technical aptitude in a vacuum. While being able to implement & correctly use a complex data structure certainly provides credence to the idea that one *can* be a good engineer, in 2019 evaluating on that basis alone is simply not enough. \n\nIn my assessment, great engineers have a high degree of *emotional intelligence* alongside technical aptitude. Factors such as working collaboratively with others, knowing how to handle conflict gracefully, and being kind are just as important (if not more so) as being able to come up with sophisticated technical designs and banging out large amounts of code. \n\nBut sadly, emotional intelligence is not what most of the industry optimizes for. There’s countless stories of individuals (many of them minorities) being frustrated with how hiring is conducted in tech to the point of considering leaving the industry. \n\nI do have some hope though. When I was interviewing in April through June I made a point of optimizing **heavily** for culture fit, preferring companies that matched my values and that had made an attempt to fix what's currently so broken about tech interviewing. I'm happy to say I found several companies with the thoughtful ethos I was seeking (including the one I work at now 🙂). \n\nThe future of hiring needs to be more human-focused. Strictly focusing on technical ability opens the door to a [whole lot of bias](https://www.geekwire.com/2016/changing-how-software-companies-interview-could-reduce-gender-bias-in-tech/) that keeps us homogenous and lacking in perspective. To anyone reading this that is struggling to gain a foothold, know that there are places that will recognize your worth.\n\nMy experiences still come from a relatively privileged place since I look like the many already in tech, but I hope to do my small part by engaging with places that are making a genuine effort to move the needle on some of our industry’s issues. If anyone reading this is interested in finding constructive ways to improve on what is currently not the best situation, feel free to get in touch. \n\nAnd so ends my first (very rant-y) stream of consciousness post. ✌🏽	2020-09-24 23:24:40.708701+00	\N	2019-09-08 23:32:39.582+00	2020-09-29 21:26:02.363906+00
b2a46d76-1b0e-4e9c-9d65-f4fd4ce1274e	Apple's Disjointed Ecosystem	apple's-disjointed-ecosystem	# Apple's Disjointed Ecosystem\n\n	2020-11-26 03:20:59.998799+00	2020-11-26 03:21:47.825606+00	\N	\N
7b0e4528-d0a5-4fdc-b462-c3aed4c36947	Personal Blog Setup	personal-blog-setup	# Personal Blog Setup\n\nI promised that when I first started this site that I would write a follow-up post about how it’s structured.\n\nWhat started out as a single virtual machine on Amazon's EC2 has turned into a collection of services managed in a Kubernetes cluster on [GKE](https://cloud.google.com/kubernetes-engine/?utm_campaign=na-US-all-en-dr-bkws-all-all-trial-p-dr-1008076&utm_term=KW_google+kubernetes-ST_google+kubernetes&gclid=EAIaIQobChMIuZ-5jYyP6QIVNB-tBh1W4Qv-EAAYASAAEgLnmfD_BwE&utm_content=text-ad-none-any-DEV_c-CRE_289938543037-ADGP_Hybrid+%7C+AW+SEM+%7C+BKWS+%7C+US+%7C+en+%7C+PHR+%7E+Compute+%7E+Kubernetes+-+google+kubernetes-KWID_43700036066896966-kwd-342467319720&utm_source=google&utm_medium=cpc).\n\nThe main entrypoint of the application is through a Next.js server, but there is also a Go server that contains all the site's APIs, and another dedicated deployment for authentication management. \n\n## Is all this overkill?\n\nSome people will probably look at this and scoff at how much is going on. It’s **totally** not necessary to start a Kubernetes cluster for a blog site! In fact, you probably shouldn’t! \n\nSoftware design decisions depend greatly on the context. I've used "writing a blog" (perhaps better stated as *building a blog*) for quite some time as the stimulus for learning new technologies . Some things I have learned since first beginning work in 2018:\n\n- Go, the programming language\n- Creating containerized applications with Docker\n- Contributing to [other software projects](https://github.com/fusionauth/go-client)\n- Understanding the value prop of cloud services and evaluating their trade offs. I’m now familiar with both AWS and GCP\n- And of course, Kubernetes, for managing the various things I need to deploy in a fault tolerant manner \n\nSlow, incremental progress towards building / designing my own system from scratch has resulted in lots of knowledge that is useful in other domains. \n\nWhile this system is downright **extra** for one person writing a couple of articles a year (aka me 🤪), it has become a foundation on which I can build more interesting things. \n\nIn the near-ish term, I’m working on building an interactive programming course that goes beyond the usual tutorial content by integrating an IDE directly in the browser. \n\n![code tutorial running a full IDE on my blog site](https://storage.googleapis.com/download/storage/v1/b/medhir-com/o/blog%2Fassets%2F7b0e4528-d0a5-4fdc-b462-c3aed4c36947%2F32d64e63-b243-4400-8187-31f7991f9a99.jpg?generation=1601414953682100&alt=media)\n\nI have the problem of having too many outstanding side-projects so it’ll probably be a while still before I have anything I can put out in front of real users.\n\nI do hope to build something that really engages learners and show what programming courses can look like in 2020. There is, however, a bunch of work to be done... 😳\n\nStay tuned I suppose!\n	2020-09-24 23:24:40.704644+00	\N	2020-04-30 02:35:03.612+00	2020-09-30 19:09:11.899497+00
56ce08a2-afc1-4baa-8058-d3592d181f70	My Experience with ADHD	my-experience-with-adhd	# My Experience with ADHD \n\nAs we come to a close of a year that has upended pretty much everything, I'd like to write about myself in a way I’ve wanted to for many years, but never seemed to have the courage to do so. \n\nI’ve struggled with mental health challenges since I was a teenager, and only recently have I come to learn that this struggle stems from undiagnosed ADHD. \n\n	2020-12-02 05:14:01.802136+00	2020-12-08 23:49:48.072647+00	\N	\N
ba0db4e1-8651-4d2c-b7eb-3bead8dc0e2c	Using Puppeteer to Model UX Flows	using-puppeteer-to-model-ux-flows	# Using Puppeteer to Model UX Flows	2020-12-02 23:27:28.708325+00	2020-12-02 23:27:45.507175+00	\N	\N
8946122e-672f-478c-9b17-267d635f0ed0	Digital Colonizers	digital-colonizers	# Digital Colonizers\n\nFor a couple years I’ve been thinking about how the strategy of growth-at-all-costs adopted by Silicon Valley culture looks quite similar to a historic practice that we can all agree is bad: **colonization**. \n\nIn essense, the mindsets of many tech leaders amounts to a new, *digital* version of global exploitation. It’s no longer necessary to physically dominate a person — the colonizers of today use psychological manipulation instead. \n\nIt all started innocently enough. The foundations of companies like Facebook, Google, and Amazon were built on the perception that these products were meant to *connect* people or to provide a *convenience* to make your life easier. \n\nBut the message of building future tech utopias through unbridled capitalism always masked a more insidious reality, one that the digital oppressors would rather you not think about: building the kind of power that entire nation-states weild. \n\nMany of these companies adopt language to suggest they are going to save the world. But really, who are they saving? What is actually happening behind the scenes? Are they actually doing work that redeems western society from the original sins of colonial oppression, or has the shape of oppression merely shifted?\n\n## Mission Driven\n\nLike colonizers of the past, companies often adopt the term **mission** to describe their intent. Recently Coinbase took a public position 	2020-09-30 19:12:57.06735+00	2020-10-03 07:22:03.87967+00	\N	\N
0b553adc-4910-4db4-8492-2623fe331c5b	Discarded	discarded	# Discarded\n\nI have ADHD. I've always had ADHD, though I only came to realize officially through a diagnosis in August of this year. ADHD has impacted my life in profound ways that I'm only now starting to see with clarity, but to most everyone else these impacts don't register. I'm seen as normal, the disabling aspects of my biology entirely invisible to the casual observer. \n\nI've been wanting to write about my mental health challenges publicly for years. My experience disclosing mental illness in any capacity has been mostly detrimental, so the fear of what happens after I publish something has always held me back. But you know what? It's 2020, our previous ways of living are changing rapidly, and I no longer find it acceptable to keep this side of myself hidden. Quite truly, fuck it. \n\nI've been reflecting on my experiences trying to build a career with significant mental health challenges lately, and at times the totality of my journey and its shortcomings hits me like a ton of bricks. Despite programming since 2014, despite constantly challenging myself to level-up my skill set, I still find myself justifying to others **why** my experience is equivalent to someone w\n\nBecause with years of experience building software behind me, I now know its not my skillset or aptitude that are lacking. What's lacking is any version of structural support for those that don't fit within a very specific "good worker" mold. \n\n### The Good™️ Worker\n\nThe Good Worker is someone that went through life \n\nI've kept my struggles bottled up for so long that I don't even know where to start. My desire to write about the ableism I've experienced \n\n### Tweets to Add\n\n[tech is severely borken](https://twitter.com/DataSciBae/status/1339286740469616640?s=20)\n	2020-12-16 21:47:06.977614+00	2020-12-16 22:47:08.936677+00	\N	\N
565909f6-6696-4416-8244-7944e62a5a86	Reimagining the Post Office	reimagining-the-post-office	# Reimagining the Post Office \n\n- services for small businesses connected to the digital age. Specifically API driven scheduling to deliver invoiced goods to customers. \n- provide workers a wage higher than what Amazon / UPS do 	2020-12-23 09:03:20.729264+00	2020-12-23 09:05:34.958044+00	\N	\N
af657d3c-15d5-4119-8375-09cd904c39c4	Thoughts on Tech Hiring and Promoting Change	thoughts-on-tech-hiring-and-promoting-change	# Thoughts on Tech Hiring and Promoting Change\n\nI was laid off in May this year. Losing job security and health insurance in the middle of a pandemic was downright shitty. But you know what made me feel worse? The anxiety induced by thinking that I’d have to go through many, many technical interviews to land another role. \n\n![sad emojis on a whiteboard](https://storage.googleapis.com/download/storage/v1/b/medhir-com/o/blog%2Fassets%2Faf657d3c-15d5-4119-8375-09cd904c39c4%2Fff737159-9f6b-4117-acfd-6b7263921d0f.jpg?generation=1602281976358177&alt=media)\n\nFor those of you unfamiliar with programming interviews: a majority of software companies expect candidates to prove their competency by answering technical questions by writing code on a whiteboard (or in COVID times, a Google doc). The emphasis of these questions is usually placed on fundamental computer science concepts such as data structures and algorithms, a practice popularized by Google and subsequently adopted by the industry at large. \n\nThe rationale behind this interview format is to provide a somewhat standardized way to assess a candidate’s problem solving skills. The format also provides a chance to see the engineer’s coding capacities — after all, what better way of getting to know a programmer than having them program? \n\nIf you are a software developer, you will most likely understand intimately what it **feels** like to go through tens, or maybe hundreds, of rounds where some stranger gets to judge you for how well you are able to think out loud and solve problems under a time crunch. And that feeling often times isn't so great.\n\n## Evaluating Anxiety More Than Aptitude \n\nA collaborative study done by North Carolina State University and Microsoft provides evidence that the current technical interview format [evaluates performance anxiety more than it does programming competency](https://www.sciencedaily.com/releases/2020/07/200714101228.htm#:~:text=Summary%3A,or%20favor%20specific%20job%20candidates.). \n\nActual software development often requires slow, deliberate thinking and time to research potential solutions to problems. Absolutely no one would expect you in a real-life setting to come up with solutions within 45 minutes to an hour. The time to develop functional software is measured in days, weeks, sometimes months. \n\nFurthermore, the algorithmic concepts used mostly originate from academia, the result of decades of work among computer science researchers trying to push the state of the state of the art. If you have no familiarity with the particular algorithm the interviewer is quizzing you on, what are the chances you’ll be able to “problem solve” in the allotted time? This is like asking someone to do the work of **entire PhD theses** in less than an hour. \n\nSo it's not surprising to see that the high-stakes situation presented by whiteboard coding would induce (and mostly assesses) performance anxiety – interviews look nothing like day-to-day software development. \n\n## The Privileged Status Quo\n\nThere are some companies that recognize the flaws of this process and [have adapted their hiring processes](https://github.com/poteto/hiring-without-whiteboards). Unfortunately, all of the biggest companies still expect candidates to answer questions about data structures and algorithmic analysis in a timed, isolated setting. Even Microsoft, with its recent research on the efficacy (or lack thereof) of current interviewing practices, persists with the whiteboarding format.\n\nPerhaps it’s worth acknowledging that plenty of people in tech have a vested interest in continuing this enterprise. For those who have made it through the system, there is sometimes [survivorship bias](https://en.m.wikipedia.org/wiki/Survivorship_bias) that makes the individual believe they got the job on merit, rather than luck, privilege, or the cognitive biases of their interviewers. It’s basically a form of [Stockholm syndrome](https://en.m.wikipedia.org/wiki/Stockholm_syndrome) where the imagination of what’s possible if we were to revisit the current evaluation criteria has been snuffed out by years of being told that this is the *best* way to screen candidates. \n\nBut there’s also plenty of money to be made — there’s a sizeable cottage industry around preparing potential candidates to land the job at that big tech firm. A [quick Google search on interview prep](https://www.google.com/search?q=coding+interview+prep) reveals a barrage of advertisements for books, courses, and other services aimed at those willing to fork out time (and money) to gain an advantage in the process. Those lucky enough to attend the top CS programs [have courses tailor made](https://web.stanford.edu/class/cs9/) towards being successful in these settings. \n\n![Google ads for technical interview prep](https://storage.googleapis.com/download/storage/v1/b/medhir-com/o/blog%2Fassets%2Faf657d3c-15d5-4119-8375-09cd904c39c4%2F734f5ae0-d5d2-41af-9c97-eff7dba32518.jpg?generation=1602193804259544&alt=media)\n\nGiven these dynamics, the classic technical interview has evolved to become much like the SAT used by US college admissions committees. Those with more privilege fare better, because they most often have time and monetary resources necessary to prep diligently.\n\n## Who Gets Left Behind \n\nThis process optimizes most heavily in favor of a specific type of candidate: those newly out of college, CS theory fresh in mind, with plenty of time to devote to studying. If you are an older seasoned professional, a parent with children to take care of, or are transitioning to tech from another career, sinking a sizable amount of time into subjects that have little relevance to the actual profession has the chance to cause significant undue hardship. \n\nReferencing the NC State study mentioned earlier, this interview format is straight up **ableist** to those suffering from mental health issues, particularly anxiety. Even if you just have test performance anxiety, this process sets you up for failure. \n\nBut most importantly, I'd argue that almost everyone pursuing the software profession suffers under this system. I’ve had way too many conversations with engineers where the person I’m talking to says something like *“I’m thinking of leaving my job,”* only to find that person in the same role a year later. And why is that?\n\nI'd say it's because the idea of having to go and prepare several hours each day for months is a cost too high for many people. And companies **like it that way** because that means you shop around less, and have less bargaining power when it comes time to talk about pay increases and promotions.\n\n## The Need for Advocacy and Organizing\n\nSoftware engineers are one of the only professional class of workers that put up with such practices. Imagine, if you will, a medical doctor interviewing and having to drill through the nuances of anatomy rather than discussing how they go through their clinical practice. On the face of it, this situation seems absurd, yet this is the expectation for landing top roles in the industry.\n\nWe recognize the current state of affairs is Bad™️. The problem with just recognizing the situation is that we keep having conversations about Just How Bad it is and going in circles. Nothing will change up until we start organizing as a collective and proposing new, more inclusive ways of evaluating talent. \n\nIf you are one of the fortunate ones to be employed by a company like Facebook, Amazon, Apple, Microsoft, or Google – would you take a pledge to refuse to participate in whiteboard interviews? \n\nConversely, if you are looking for employment as a desirable candidate, would you pledge to not take any interviews that require whiteboard coding? \n\nWould you agree to participate in discussions with your peers and push for change until there is tangible consensus on how to improve the situation?\n\nUnderstandably this is a tall order. From reading tech forums like [Hacker News](https://news.ycombinator.com/news), it's clear that a sizable percentage of software engineers have an aversion to thinking about labor unions in any form. I'd simply encourage those of you who feel comfortable with the status quo to introspect and consider that not everyone has the capacity to perform well in this interview setting, though that doesn't make them any less qualified. There are so many talented people that would benefit immensely from having different methods to showcase their skills, and I sincerely hope we all can work toward realizing that brighter future. \n\n\n\n	2020-10-06 06:02:19.832744+00	2020-10-09 22:21:51.997774+00	2020-10-09 22:21:52.001231+00	2020-10-15 15:03:11.650671+00
65ecc2fb-8b34-442c-a8d3-22258df7a0ef	The Disjointedness of Airplay	the-disjointedness-of-airplay	# The Disjointedness of Airplay\n\nI really wish this didn't bother me as much as it did. As a long-time iPhone and Mac user, I'm pretty invested in the ecosystem and use Airplay-enabled devices to play music throughout my house. For the most part it works wonderfully – Being able to use multiple speakers wirelessly through Airplay 2 has enabled significant cost savings compared to wiring up speakers through walls to connect to an amplifier, or having to buy another dedicated product such as Sonos. \n\nBut as great as this system is, there seems to be a general incoherence in the ecosystem that Apple refuses to fix: **[you can only stream to one speaker at a system level on MacOS](https://support.apple.com/en-us/HT202809)**. Airplay 2 support has been conspicuously omitted from MacOS since its release two years ago. The only way to stream music to multiple speakers on your Mac is through iTunes. \n\nApple has traditionally been known for maintaining high-quality, tight integrations amongst devices in their ecosystem. For example, you can copy a piece of text on your Mac and paste it on your iPhone. You can pick up a regular cell phone call on your Mac. But despite this focus on tight integration, you can only use multiple Airplay speakers through iOS. \n\n\n\n	2020-12-12 19:57:09.665551+00	2020-12-15 01:24:32.398657+00	\N	\N
896ad3f9-0b02-4033-bd61-0e599cc65b74	On Building Bespoke Things	on-building-bespoke-things	# On Building Bespoke Things\n\n![pink reflective spheres against a black background](https://storage.googleapis.com/download/storage/v1/b/medhir-com/o/blog%2Fassets%2F896ad3f9-0b02-4033-bd61-0e599cc65b74%2Fe0508748-08eb-4792-91c5-e387e91224df.jpg?generation=1601327258786527&alt=media)\n\nAt a time where the culture of building things is highly intertwined with producing something that benefits capital endeavors, it’s nice to take a step back and ask, “What can I build for myself?”  \n\nBuilding something of significant importance for yourself is a way of running counter to the grind ethos that is so prevalent today. Pretty much anything can (and *will*) be commodified. \n\nFor me it’s all been about practicing my own growth. To have taken something from just an idea to full fruition has been incredibly satisfying. Every time I encounter a road block, it becomes an opportunity to learn something new and get closer to realizing the thing I want.   \n\nFrom the time I was in high school, I desired to have a personal web page that reflects my sensibilities. I eventually coalesced on a goal to build a blogging platform. \n\nIt took several years of learning before I had the design and implementation skills to pull it off. For a while I was discouraged from even trying, with defeatist thoughts like *“Why build a crappier version of something that already exists?”* or *“You don’t know what you’re doing.”* \n\nBut despite all the negative energy that initially deterred me, I eventually decided that it *did not matter* if the thing I built was worse than what already exists. The fact that it was something that I invested in for myself was enough. That became the point where I started on it, with no expectations for what it would become or how long it would take.\n\nI started with what I knew (building web-based user interfaces) and came up with the basic look and feel of the site. From there I started to think about what I want to be able to *do* when visiting. It boiled down to a few things:\n\n- public facing pages for both blog entries and photos I take \n- a way to login to an “edit” mode where I could create new content \n\nThough I had worked on several large codebases prior to this personal project, it was only through building something from the ground up that I had the chance to think so deeply about how various parts of a software system come together. \n\nBuilding bespoke things is a journey. To satisfy just these few goals, I had to think about system architecture, authentication management, graphic design, user experience workflows, cloud infrastructure, software deployment strategies and more. \n\nThe work initially came in spurts. I would have to work up the motivation to learn the next thing needed, always keeping a reminder that I was first and foremost doing this just to satisfy **myself**.\n\nBut over time of continued investment, there reached a threshold where I no longer had to “work up” the motivation. The bespoke system was coming together. Pushing through obstacles resulted in feeling more confident that I can build something unique no matter how particular the requirement. \n\n\n\n\n\n 	2020-09-27 20:49:30.7088+00	2020-09-29 19:10:09.080011+00	\N	\N
\.


--
-- Data for Name: blogpostasset; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.blogpostasset (post_id, name, url) FROM stdin;
896ad3f9-0b02-4033-bd61-0e599cc65b74	blog/assets/896ad3f9-0b02-4033-bd61-0e599cc65b74/e0508748-08eb-4792-91c5-e387e91224df.jpg	https://storage.googleapis.com/download/storage/v1/b/medhir-com/o/blog%2Fassets%2F896ad3f9-0b02-4033-bd61-0e599cc65b74%2Fe0508748-08eb-4792-91c5-e387e91224df.jpg?generation=1601327258786527&alt=media
c76afac7-533e-486e-aed7-4c46adba9f81	blog/assets/c76afac7-533e-486e-aed7-4c46adba9f81/b5cb2dde-b2ce-4918-80b8-2e35fc847aeb.jpg	https://storage.googleapis.com/download/storage/v1/b/medhir-com/o/blog%2Fassets%2Fc76afac7-533e-486e-aed7-4c46adba9f81%2Fb5cb2dde-b2ce-4918-80b8-2e35fc847aeb.jpg?generation=1601414204849358&alt=media
7b0e4528-d0a5-4fdc-b462-c3aed4c36947	blog/assets/7b0e4528-d0a5-4fdc-b462-c3aed4c36947/32d64e63-b243-4400-8187-31f7991f9a99.jpg	https://storage.googleapis.com/download/storage/v1/b/medhir-com/o/blog%2Fassets%2F7b0e4528-d0a5-4fdc-b462-c3aed4c36947%2F32d64e63-b243-4400-8187-31f7991f9a99.jpg?generation=1601414953682100&alt=media
af657d3c-15d5-4119-8375-09cd904c39c4	blog/assets/af657d3c-15d5-4119-8375-09cd904c39c4/734f5ae0-d5d2-41af-9c97-eff7dba32518.jpg	https://storage.googleapis.com/download/storage/v1/b/medhir-com/o/blog%2Fassets%2Faf657d3c-15d5-4119-8375-09cd904c39c4%2F734f5ae0-d5d2-41af-9c97-eff7dba32518.jpg?generation=1602193804259544&alt=media
af657d3c-15d5-4119-8375-09cd904c39c4	blog/assets/af657d3c-15d5-4119-8375-09cd904c39c4/ff737159-9f6b-4117-acfd-6b7263921d0f.jpg	https://storage.googleapis.com/download/storage/v1/b/medhir-com/o/blog%2Fassets%2Faf657d3c-15d5-4119-8375-09cd904c39c4%2Fff737159-9f6b-4117-acfd-6b7263921d0f.jpg?generation=1602281976358177&alt=media
\.


--
-- Data for Name: course; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.course (id, author_id, title, description, master_pvc_name, created_at, updated_at, published_at, revised_at) FROM stdin;
07a2f837-5a55-465f-993f-657806bbced4	5ac11830-8c65-4e44-b794-0398dc819e00	Hello there	Blip 70,000	medhir-com-course-d0b82cbd-69c2-4979-aaea-337f648711df	2020-10-29 20:57:33.352134+00	2020-10-29 20:57:52.055613+00	\N	\N
\.


--
-- Data for Name: lesson; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.lesson (id, course_id, title, mdx, "position", folder_name, created_at, updated_at) FROM stdin;
164908f1-70b3-48cc-84c1-7135159b3095	07a2f837-5a55-465f-993f-657806bbced4	Hello, world!	# Hello, world!\n	0	/home/coder/project/helloworld/	2020-10-29 20:57:57.075259+00	2020-11-26 00:07:26.421536+00
\.


--
-- Data for Name: lessonasset; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.lessonasset (lesson_id, name, url) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.schema_migrations (version, dirty) FROM stdin;
6	f
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."user" (id, username, email, first_name, last_name, stripe_customer_token, instance_password) FROM stdin;
5ac11830-8c65-4e44-b794-0398dc819e00	medhir	mail@medhir.com	\N	\N	\N	\N
\.


--
-- Name: blogpost blogpost_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blogpost
    ADD CONSTRAINT blogpost_pkey PRIMARY KEY (id);


--
-- Name: blogpost blogpost_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blogpost
    ADD CONSTRAINT blogpost_slug_key UNIQUE (slug);


--
-- Name: blogpost blogpost_title_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blogpost
    ADD CONSTRAINT blogpost_title_key UNIQUE (title);


--
-- Name: course course_master_pvc_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course
    ADD CONSTRAINT course_master_pvc_name_key UNIQUE (master_pvc_name);


--
-- Name: course course_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course
    ADD CONSTRAINT course_pkey PRIMARY KEY (id);


--
-- Name: lesson lesson_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lesson
    ADD CONSTRAINT lesson_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: user user_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_key UNIQUE (email);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: user user_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_username_key UNIQUE (username);


--
-- Name: blogpostasset blogpostasset_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blogpostasset
    ADD CONSTRAINT blogpostasset_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.blogpost(id);


--
-- Name: course course_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course
    ADD CONSTRAINT course_author_id_fkey FOREIGN KEY (author_id) REFERENCES public."user"(id);


--
-- Name: lesson lesson_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lesson
    ADD CONSTRAINT lesson_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.course(id);


--
-- Name: lessonasset lessonasset_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lessonasset
    ADD CONSTRAINT lessonasset_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lesson(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: -
--

-- REVOKE ALL ON SCHEMA public FROM cloudsqladmin;
-- REVOKE ALL ON SCHEMA public FROM PUBLIC;
-- GRANT ALL ON SCHEMA public TO cloudsqlsuperuser;
-- GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--