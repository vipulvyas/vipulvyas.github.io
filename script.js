$(document).ready(function () {

    /* ─── STICKY NAV ─── */
    $(window).on('scroll', function () {
        $('nav').toggleClass('sticky', this.scrollY > 30);
    });

    /* ─── MOBILE MENU ─── */
    $('.menu-btn').on('click', function () {
        $('nav ul').toggleClass('active');
        $(this).find('i').toggleClass('fa-bars fa-times');
    });
    $('nav ul li a').on('click', function () {
        $('nav ul').removeClass('active');
        $('.menu-btn i').addClass('fa-bars').removeClass('fa-times');
    });

    /* ─── TYPED.JS ─── */
    if ($('.typing').length) {
        new Typed('.typing', {
            strings: [
                'Senior Software Engineer',
                'Fintech Solutions Architect',
                'Scalable Systems Specialist',
                'Full Stack Developer'
            ],
            typeSpeed: 60,
            backSpeed: 30,
            loop: true
        });
    }

    /* ─── SMOOTH SCROLL ─── */
    $('a[href*="#"]').on('click', function (e) {
        const href = $(this).attr('href');
        if (href && href.startsWith('#') && $(href).length) {
            e.preventDefault();
            $('html, body').animate({ scrollTop: $(href).offset().top - 80 }, 600, 'swing');
        }
    });

    /* ─── EXPERIENCE TABS ─── */
    $('.exp-tab').on('click', function () {
        const tab = $(this).data('tab');
        $('.exp-tab').removeClass('active');
        $(this).addClass('active');
        $('.exp-panel').removeClass('active');
        $('#tab-' + tab).addClass('active');
    });

    /* ─── SCROLL REVEAL ─── */
    const revealSel = '.compliance-card, .skill-group, .work-card, .blog-card, .about-container, .exp-container, .contact-container';
    $('<style>.revealed { opacity: 1 !important; transform: translateY(0) !important; }</style>').appendTo('head');
    $(revealSel).css({ opacity: 0, transform: 'translateY(28px)', transition: 'opacity 0.6s ease, transform 0.6s ease' });
    const reveal = () => {
        const wH = $(window).height();
        $(revealSel).each(function () {
            if (this.getBoundingClientRect().top <= wH * 0.9) $(this).addClass('revealed');
        });
    };
    $(window).on('scroll', reveal);
    setTimeout(reveal, 200);

    /* ─── MEDIUM RSS FEED (Live) ─── */
    const MEDIUM_USER = 'vipulvyas';
    const RSS_API = `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@${MEDIUM_USER}&api_key=&count=6`;

    function formatDate(dateStr) {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    function stripHtml(html) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        const text = tmp.textContent || tmp.innerText || '';
        return text.replace(/\s+/g, ' ').trim().substring(0, 140) + '…';
    }

    function renderBlogs(items) {
        const grid = $('#blogsGrid');
        grid.empty();
        if (!items || items.length === 0) {
            grid.html('<p style="color:var(--text-dim); text-align:center; grid-column:1/-1;">Could not load articles. <a href="https://medium.com/@' + MEDIUM_USER + '" target="_blank" style="color:var(--primary-color)">View on Medium →</a></p>');
            return;
        }

        // Filter out non-article items and show max 6
        const articles = items.filter(item => item.title && item.link).slice(0, 6);

        articles.forEach(item => {
            const dateLabel = formatDate(item.pubDate);
            const excerpt = item.description ? stripHtml(item.description) : '';
            // Pick first tag/category as label
            const tag = (item.categories && item.categories.length) ? item.categories[0] : 'Engineering';

            const card = `
                <a class="blog-card" href="${item.link}" target="_blank" rel="noopener">
                    <span class="date"><i class="fas fa-calendar-alt"></i> ${dateLabel} &nbsp;·&nbsp; <em>${tag}</em></span>
                    <h3>${item.title}</h3>
                    <p>${excerpt}</p>
                    <span class="read-more">Read on Medium →</span>
                </a>`;
            grid.append(card);
        });

        // Apply reveal to freshly inserted cards
        $('.blog-card').css({ opacity: 0, transform: 'translateY(28px)', transition: 'opacity 0.6s ease, transform 0.6s ease' });
        setTimeout(reveal, 100);
    }

    // Attempt live fetch
    $.ajax({
        url: RSS_API,
        method: 'GET',
        timeout: 8000,
        success: function (data) {
            if (data.status === 'ok' && data.items) {
                renderBlogs(data.items);
            } else {
                // Fallback: render a curated static list
                renderFallbackBlogs();
            }
        },
        error: function () {
            renderFallbackBlogs();
        }
    });

    // Fallback if API is down or rate-limited — sourced from the user's actual posts
    function renderFallbackBlogs() {
        const staticPosts = [
            {
                title: 'A Comprehensive Guide to PostgreSQL MVCC: Transactions, Isolation, Physical Storage and VACUUM',
                link: 'https://vipulvyas.medium.com/a-comprehensive-guide-to-postgresql-mvcc-transactions-isolation-physical-storage-and-vacuum-7e31d028d488',
                pubDate: '2025-07-31',
                description: 'A deep dive into PostgreSQL internals — how MVCC handles concurrency, the physical storage model, transaction isolation levels, and the VACUUM process.',
                categories: ['PostgreSQL Database']
            },
            {
                title: 'Message Queues in System Design: The Backbone of Scalable Systems',
                link: 'https://vipulvyas.medium.com/message-queues-in-system-design-the-backbone-of-scalable-systems-95b900311c3e',
                pubDate: '2026-04-06',
                description: 'How message queues enable asynchronous, fault-tolerant, and decoupled services in distributed system design.',
                categories: ['System Design']
            },
            {
                title: 'Understanding Database Internals: How Tables and Indexes are Stored on Disk',
                link: 'https://vipulvyas.medium.com/understanding-database-internals-how-tables-and-indexes-are-stored-on-disk-and-queried-7cf09a6a48a4',
                pubDate: '2023-07-22',
                description: 'A practical look at how relational databases physically store tables and indexes — pages, extents, heap files, and more.',
                categories: ['Database']
            },
            {
                title: 'Optimizing Feature Flags in MySQL: A Bitwise Approach',
                link: 'https://vipulvyas.medium.com/optimizing-feature-flags-in-mysql-a-bitwise-approach-c8cc088f5a63',
                pubDate: '2023-11-11',
                description: 'How to use bitwise operations in MySQL to store and query feature flags efficiently without multiple boolean columns.',
                categories: ['MySQL']
            },
            {
                title: 'ACID Property: Ensuring Data Integrity and Reliability in Database Transactions',
                link: 'https://vipulvyas.medium.com/acid-property-ensuring-data-integrity-and-reliability-in-database-transactions-9e47df4dab85',
                pubDate: '2023-07-08',
                description: 'A thorough explanation of Atomicity, Consistency, Isolation, and Durability in the context of modern relational databases.',
                categories: ['Database']
            },
            {
                title: 'Scale WebSocket using Redis and HAProxy',
                link: 'https://vipulvyas.medium.com/scale-websocket-using-redis-and-haproxy-8e09e4d6ae87',
                pubDate: '2023-01-29',
                description: 'How to horizontally scale WebSocket servers using Redis Pub-Sub as the message broker and HAProxy for sticky session load balancing.',
                categories: ['Backend, System Design']
            }
        ];
        renderBlogs(staticPosts);
    }

    /* ─── CONTACT FORM ─── */
    $('#contactForm').on('submit', function (e) {
        e.preventDefault();
        const btn = $(this).find('button[type="submit"]');
        btn.html('<i class="fas fa-check"></i> Message Sent!').css('opacity', '0.7').prop('disabled', true);
        setTimeout(() => btn.html('<i class="fas fa-paper-plane"></i> Send Message').css('opacity', '1').prop('disabled', false), 3500);
    });

});
