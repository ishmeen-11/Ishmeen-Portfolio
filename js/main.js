/* ===================================================================
 * Luther 1.0.0 - Main JS
 *
 * ------------------------------------------------------------------- */

(function (html) {

    "use strict";

    html.className = html.className.replace(/\bno-js\b/g, '') + ' js ';



    /* Animations
     * -------------------------------------------------- */
    const tl = anime.timeline({
        easing: 'easeInOutCubic',
        duration: 800,
        autoplay: false
    })
        .add({
            targets: '#loader',
            opacity: 0,
            duration: 1000,
            begin: function (anim) {
                window.scrollTo(0, 0);
            }
        })
        .add({
            targets: '#preloader',
            opacity: 0,
            complete: function (anim) {
                document.querySelector("#preloader").style.visibility = "hidden";
                document.querySelector("#preloader").style.display = "none";
            }
        })
        .add({
            targets: '.s-header',
            translateY: [-100, 0],
            opacity: [0, 1]
        }, '-=200')
        .add({
            targets: ['.s-intro .text-pretitle', '.s-intro .text-huge-title'],
            translateX: [100, 0],
            opacity: [0, 1],
            delay: anime.stagger(400)
        })
        .add({
            targets: '.circles span',
            keyframes: [
                { opacity: [0, .3] },
                { opacity: [.3, .1], delay: anime.stagger(100, { direction: 'reverse' }) }
            ],
            delay: anime.stagger(100, { direction: 'reverse' })
        })
        .add({
            targets: '.intro-social li',
            translateX: [-50, 0],
            opacity: [0, 1],
            delay: anime.stagger(100, { direction: 'reverse' })
        })
        .add({
            targets: '.intro-scrolldown',
            translateY: [100, 0],
            opacity: [0, 1]
        }, '-=800');



    /* Preloader
     * -------------------------------------------------- */
    const ssPreloader = function () {

        const preloader = document.querySelector('#preloader');
        if (!preloader) return;

        window.addEventListener('load', function () {
            document.querySelector('html').classList.remove('ss-preload');
            document.querySelector('html').classList.add('ss-loaded');

            document.querySelectorAll('.ss-animated').forEach(function (item) {
                item.classList.remove('ss-animated');
            });

            tl.play();
        });

        // force page scroll position to top at page refresh
        // window.addEventListener('beforeunload' , function () {
        //     // window.scrollTo(0, 0);
        // });

    }; // end ssPreloader


    /* Mobile Menu
     * ---------------------------------------------------- */
    const ssMobileMenu = function () {

        const toggleButton = document.querySelector('.mobile-menu-toggle');
        const mainNavWrap = document.querySelector('.main-nav-wrap');
        const siteBody = document.querySelector("body");

        if (!(toggleButton && mainNavWrap)) return;

        toggleButton.addEventListener('click', function (event) {
            event.preventDefault();
            toggleButton.classList.toggle('is-clicked');
            siteBody.classList.toggle('menu-is-open');
        });

        mainNavWrap.querySelectorAll('.main-nav a').forEach(function (link) {
            link.addEventListener("click", function (event) {

                // at 800px and below
                if (window.matchMedia('(max-width: 800px)').matches) {
                    toggleButton.classList.toggle('is-clicked');
                    siteBody.classList.toggle('menu-is-open');
                }
            });
        });

        window.addEventListener('resize', function () {

            // above 800px
            if (window.matchMedia('(min-width: 801px)').matches) {
                if (siteBody.classList.contains('menu-is-open')) siteBody.classList.remove('menu-is-open');
                if (toggleButton.classList.contains("is-clicked")) toggleButton.classList.remove("is-clicked");
            }
        });

    }; // end ssMobileMenu


    /* Highlight active menu link on pagescroll
     * ------------------------------------------------------ */
    const ssScrollSpy = function () {

        const sections = document.querySelectorAll(".target-section");

        // Add an event listener listening for scroll
        window.addEventListener("scroll", navHighlight);

        function navHighlight() {

            // Get current scroll position
            let scrollY = window.pageYOffset;

            // Loop through sections to get height(including padding and border), 
            // top and ID values for each
            sections.forEach(function (current) {
                const sectionHeight = current.offsetHeight;
                const sectionTop = current.offsetTop - 50;
                const sectionId = current.getAttribute("id");

                /* If our current scroll position enters the space where current section 
                 * on screen is, add .current class to parent element(li) of the thecorresponding 
                 * navigation link, else remove it. To know which link is active, we use 
                 * sectionId variable we are getting while looping through sections as 
                 * an selector
                 */
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    document.querySelector(".main-nav a[href*=" + sectionId + "]").parentNode.classList.add("current");
                } else {
                    document.querySelector(".main-nav a[href*=" + sectionId + "]").parentNode.classList.remove("current");
                }
            });
        }

    }; // end ssScrollSpy


    /* Animate elements if in viewport
     * ------------------------------------------------------ */
    const ssViewAnimate = function () {

        const blocks = document.querySelectorAll("[data-animate-block]");

        window.addEventListener("scroll", viewportAnimation);

        function viewportAnimation() {

            let scrollY = window.pageYOffset;

            blocks.forEach(function (current) {

                const viewportHeight = window.innerHeight;
                const triggerTop = (current.offsetTop + (viewportHeight * .2)) - viewportHeight;
                const blockHeight = current.offsetHeight;
                const blockSpace = triggerTop + blockHeight;
                const inView = scrollY > triggerTop && scrollY <= blockSpace;
                const isAnimated = current.classList.contains("ss-animated");

                if (inView && (!isAnimated)) {
                    anime({
                        targets: current.querySelectorAll("[data-animate-el]"),
                        opacity: [0, 1],
                        translateY: [100, 0],
                        delay: anime.stagger(400, { start: 200 }),
                        duration: 800,
                        easing: 'easeInOutCubic',
                        begin: function (anim) {
                            current.classList.add("ss-animated");
                        }
                    });
                }
            });
        }

    }; // end ssViewAnimate


    /* Swiper
     * ------------------------------------------------------ */
    const ssSwiper = function () {

        const mySwiper = new Swiper('.swiper-container', {

            slidesPerView: 1,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                // when window width is > 400px
                401: {
                    slidesPerView: 1,
                    spaceBetween: 20
                },
                // when window width is > 800px
                801: {
                    slidesPerView: 2,
                    spaceBetween: 32
                },
                // when window width is > 1200px
                1201: {
                    slidesPerView: 2,
                    spaceBetween: 80
                }
            }
        });

    }; // end ssSwiper


    /* Lightbox
     * ------------------------------------------------------ */
    const ssLightbox = function () {

        const folioLinks = document.querySelectorAll('.folio-list__item-link');
        const modals = [];

        folioLinks.forEach(function (link) {
            let modalbox = link.getAttribute('href');
            let instance = basicLightbox.create(
                document.querySelector(modalbox),
                {
                    onShow: function (instance) {
                        //detect Escape key press
                        document.addEventListener("keydown", function (event) {
                            event = event || window.event;
                            if (event.keyCode === 27) {
                                instance.close();
                            }
                        });
                    }
                }
            )
            modals.push(instance);
        });

        folioLinks.forEach(function (link, index) {
            link.addEventListener("click", function (event) {
                event.preventDefault();
                modals[index].show();
            });
        });

    };  // end ssLightbox


    /* Alert boxes
     * ------------------------------------------------------ */
    const ssAlertBoxes = function () {

        const boxes = document.querySelectorAll('.alert-box');

        boxes.forEach(function (box) {

            box.addEventListener('click', function (event) {
                if (event.target.matches(".alert-box__close")) {
                    event.stopPropagation();
                    event.target.parentElement.classList.add("hideit");

                    setTimeout(function () {
                        box.style.display = "none";
                    }, 500)
                }
            });

        })

    }; // end ssAlertBoxes


    /* Smoothscroll
     * ------------------------------------------------------ */
    const ssMoveTo = function () {

        const easeFunctions = {
            easeInQuad: function (t, b, c, d) {
                t /= d;
                return c * t * t + b;
            },
            easeOutQuad: function (t, b, c, d) {
                t /= d;
                return -c * t * (t - 2) + b;
            },
            easeInOutQuad: function (t, b, c, d) {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t + b;
                t--;
                return -c / 2 * (t * (t - 2) - 1) + b;
            },
            easeInOutCubic: function (t, b, c, d) {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t * t + b;
                t -= 2;
                return c / 2 * (t * t * t + 2) + b;
            }
        }

        const triggers = document.querySelectorAll('.smoothscroll');

        const moveTo = new MoveTo({
            tolerance: 0,
            duration: 1200,
            easing: 'easeInOutCubic',
            container: window
        }, easeFunctions);

        triggers.forEach(function (trigger) {
            moveTo.registerTrigger(trigger);
        });

    }; // end ssMoveTo


    /* GitHub Integration
     * ------------------------------------------------------ */
    const ssGithubIntegration = async function () {
        const repoList = document.getElementById('github-repo-list');
        if (!repoList) return;

        try {
            const response = await fetch('https://api.github.com/users/ishmeen-11/repos?sort=updated&per_page=4');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();

            repoList.innerHTML = ''; // clear loading state
            data.forEach(repo => {
                const li = document.createElement('li');
                li.className = 'folio-list__item column';
                
                // Add animate classes
                li.setAttribute('data-animate-el', '');
                
                const lang = repo.language ? `<span class="tag-pill">${repo.language}</span>` : '';
                
                li.innerHTML = `
                    <a class="folio-list__item-link" href="${repo.html_url}" target="_blank" rel="noopener noreferrer" style="display:block; padding: 20px; background: var(--color-gray-10); border: 1px solid var(--color-border); border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); transition: all 0.3s ease;">
                        <div class="folio-list__item-text" style="padding: 0;">
                            <div class="folio-list__item-cat" style="font-family: var(--font-1); color: var(--color-1);">
                                Open Source Repo
                            </div>
                            <div class="folio-list__item-title" style="margin-top: 5px; font-size: 1.8rem; font-weight: 600;">
                                ${repo.name}
                            </div>
                            <p style="font-size: 1.4rem; color: var(--color-gray-2); margin-top: 10px; min-height: 40px;">
                                ${repo.description ? repo.description : 'A cool project by Ishmeen.'}
                            </p>
                            <div class="folio-list__item-tags" style="margin-top: 15px;">
                                ${lang}
                                <span class="tag-pill">⭐ ${repo.stargazers_count}</span>
                                <span class="tag-pill">🍴 ${repo.forks_count}</span>
                            </div>
                        </div>
                    </a>
                `;
                repoList.appendChild(li);
            });
        } catch (error) {
            console.error('Error fetching GitHub repos:', error);
            repoList.innerHTML = '<p>Could not load GitHub projects at this time.</p>';
        }
    };

    /* Medium Integration
     * ------------------------------------------------------ */
    const ssMediumIntegration = async function () {
        const articleList = document.getElementById('medium-article-list');
        if (!articleList) return;

        try {
            const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@ishmeengarewal');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();

            articleList.innerHTML = ''; // clear loading state
            
            // Only take the first 4 articles
            const articles = data.items.slice(0, 4);

            articles.forEach(article => {
                const li = document.createElement('li');
                li.className = 'folio-list__item column';
                
                // Add animate classes
                li.setAttribute('data-animate-el', '');
                
                // Extract categories/tags
                let tagsHTML = '';
                if (article.categories && article.categories.length > 0) {
                    tagsHTML = article.categories.slice(0, 2).map(cat => `<span class="tag-pill">${cat}</span>`).join('');
                }
                
                // create clean snippet
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = article.description;
                const snippet = tempDiv.textContent.substring(0, 100) + '...';

                li.innerHTML = `
                    <a class="folio-list__item-link" href="${article.link}" target="_blank" rel="noopener noreferrer" style="display:block; padding: 20px; background: var(--color-gray-10); border: 1px solid var(--color-border); border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); transition: all 0.3s ease;">
                        <div class="folio-list__item-text" style="padding: 0;">
                            <div class="folio-list__item-cat" style="font-family: var(--font-1); color: var(--color-1);">
                                Article • ${new Date(article.pubDate).toLocaleDateString()}
                            </div>
                            <div class="folio-list__item-title" style="margin-top: 5px; font-size: 1.8rem; font-weight: 600;">
                                ${article.title}
                            </div>
                            <p style="font-size: 1.4rem; color: var(--color-gray-2); margin-top: 10px; min-height: 40px;">
                                ${snippet}
                            </p>
                            <div class="folio-list__item-tags" style="margin-top: 15px;">
                                ${tagsHTML}
                            </div>
                        </div>
                    </a>
                `;
                articleList.appendChild(li);
            });
        } catch (error) {
            console.error('Error fetching Medium articles:', error);
            articleList.innerHTML = '<p>Could not load articles at this time.</p>';
        }
    };

    /* Initialize
     * ------------------------------------------------------ */
    (function ssInit() {

        ssPreloader();
        ssMobileMenu();
        ssScrollSpy();
        ssViewAnimate();
        ssSwiper();
        ssLightbox();
        ssAlertBoxes();
        ssMoveTo();
        ssGithubIntegration();
        ssMediumIntegration();

    })();

})(document.documentElement);