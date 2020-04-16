const puppeteer = require('puppeteer');

const BASE_URL = 'https://www.instagram.com/'
const TAG_URL = (tag) => `https://www.instagram.com/explore/tags/${tag}/`

const engStrings = ['Log In', 'Home', 'Like', 'Close']
const espStrings = ['Iniciar sesión', 'Inicio', 'Me gusta', 'Cerrar']

const instagram = {
    page: null,
    browser: null,
    buttonStrings: null,

    errores: 0,
    cantLikes: 0,

    initialize: async (lang) => {
        instagram.buttonStrings = (lang == 'en' || lang == 'en-US') ? engStrings : espStrings
        instagram.browser = await puppeteer.launch({
            headless: false,
        });
        instagram.page = await instagram.browser.newPage()
    },

    login: async (username, password) => {
        await instagram.page.goto(BASE_URL, { waitUtil: 'networkidle2' })

        /* typing username and password */
        await instagram.page.waitFor(1000)
        await instagram.page.type('input[name="username"]', username, { delay: 100 })
        await instagram.page.type('input[name="password"]', password, { delay: 100 })

        /* Clicking on Log In button */
        await instagram.page.waitFor(2000)
        let loginButton = await instagram.page.$x(`//div[contains(text(), "${instagram.buttonStrings[0]}")]`)
        await loginButton[0].click()
        
        /* Waiting for security code */
        await instagram.page.waitFor(10000)
        await instagram.page.waitFor(`a > svg[aria-label="${instagram.buttonStrings[1]}"]`)
    },

    likearALV: async (tags = [], cantPost) => {
        instagram.cantLikes = tags.length * cantPost
        for(let tag of tags){
            try{
                /* Going to the tag page */
                await instagram.page.goto(TAG_URL(tag), { waitUtil: 'networkidle2' })
                await instagram.page.waitFor(1500)
    
                let postImages = await instagram.page.$$('article > div:nth-child(3) img[decoding="auto"]')
                for(let i=0; i<cantPost; i++){
                    let post = postImages[i]
    
                    try{
                        /* Clicking the post */
                        await post.click()
        
                        /* Waiting for the image in all the screen */
                        await instagram.page.waitFor('body[style="overflow: hidden;"]')
                        await instagram.page.waitFor(500)
        
                        /* Like to the post */
                        let isLikeable = await instagram.page.$(`svg[aria-label="${instagram.buttonStrings[2]}"]`)
                        if(isLikeable) {
                            await instagram.page.click(`svg[aria-label="${instagram.buttonStrings[2]}"]`)
                        }
                        await instagram.page.waitFor(500)
        
                        /* Closing the image */
                        let closeButton = await instagram.page.$(`button[type="button"] > svg[aria-label="${instagram.buttonStrings[3]}"]`)
                        await closeButton.click()
                    } catch {
                        console.log('Hubo un error al likear esta foto, pasemos a la siguiente')
                        instagram.errores++
                    }

                    await instagram.page.waitFor(500)
                }
            } catch{
                console.log(`Hubo un error al cargar el tag: ${tag}, pasemos al siguiente`)
                instagram.errores++
            }

            await instagram.page.waitFor(1000)
        }
    },

    alv: async () => {
        instagram.page.close()
        instagram.browser.close()
        console.log(`Errores encontrados ${instagram.errores} de ${instagram.cantLikes} posts`)
        console.log('Fin :)')
    }

}

module.exports = instagram;