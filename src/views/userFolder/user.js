import socialWidget from './userWidgets/SocialWidget.vue'
export default {
    name: 'user',
    components: {
        "social-widget": socialWidget
    },
    // use Props to pass the users uid to fetch data
    data() {
        return {
            userData: {},
            usersFriends: [{
                    jobTitle: 'Web Developer',
                    name: 'Michael Wang',
                    color: '#ba234b',
                    dark: true,
                    avatar: {
                        src: 'https://avataaars.io/?avatarStyle=Transparent&topType=WinterHat4&accessoriesType=Prescription01&hatColor=Black&facialHairType=Blank&clotheType=GraphicShirt&clotheColor=Black&graphicType=Selena&eyeType=Squint&eyebrowType=AngryNatural&mouthType=Default&skinColor=DarkBrown',
                        size: '36'
                    }
                },
                {
                    jobTitle: 'Web Designer',
                    name: 'Jessie J',
                    color: '#e57b09',
                    dark: true,
                    avatar: {
                        src: 'https://avataaars.io/?avatarStyle=Transparent&topType=WinterHat1&accessoriesType=Sunglasses&hatColor=Red&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light',
                        size: '36'
                    }
                },
                {
                    jobTitle: 'Web Developer',
                    name: 'Jim J',
                    color: 'teal',
                    dark: true,
                    avatar: {
                        src: 'https://avataaars.io/?avatarStyle=Transparent&topType=Hat&accessoriesType=Sunglasses&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Happy&eyebrowType=Default&mouthType=Default&skinColor=Light',
                        size: '36'
                    },
                },
                {
                    jobTitle: 'Product Manager',
                    name: 'John Doe',
                    color: '#a51288',
                    dark: true,
                    cardBgImage: '/static/bg/15.jpg',
                    avatar: {
                        src: 'https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairSides&accessoriesType=Blank&hairColor=BrownDark&facialHairType=BeardMedium&facialHairColor=BrownDark&clotheType=Hoodie&clotheColor=Gray01&eyeType=WinkWacky&eyebrowType=SadConcerned&mouthType=ScreamOpen&skinColor=Brown',
                        size: '36'
                    },
                },
            ]
        }
    },
    methods: {},
    created() {
        if (this.$store.getters.isUserSignedIn) {
            this.userData = this.$store.getters.getUserData
        } else {
            this.$router.push('/')
        }
    },
}