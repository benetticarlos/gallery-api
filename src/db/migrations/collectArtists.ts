import Artworks from '../../models/Artworks'
import Users from '../../models/Users'
const creators = [
  { creator: 'example creator', address: '0x000000000000000000000000' },
  { creator: 'example creator2', address: '0x000000000000000000000000' },
]

async function getArtworksFromDataBase() {
    const artworks = await Artworks.findAll()
    const artworksEject = artworks.map(
        artwork => (artwork as any).dataValues.title
    )
    return artworksEject
}

const creatorsArr: string[] = []
const addressArr: string[] = []

export const readCreators = async () => {
    creators.forEach(element => {
        creatorsArr.push(element.creator)
        addressArr.push(element.address)
    })

    const artworksTitle = await getArtworksFromDataBase()

    creatorsArr.forEach(async element => {
        const creatorName = element.toLowerCase()
        const arrIndex = creatorsArr.indexOf(element)
        const address = addressArr[arrIndex]
        const addressInLower = address.toLowerCase()

        for (const artworkInTitle of artworksTitle) {
            if (artworkInTitle) {
                const titleInLower = artworkInTitle.toLowerCase()

                if (titleInLower.includes(creatorName)) {
                    await Artworks.update(
                        {
                            creator_username: creatorName,
                            creator_address: address,
                        },
                        { where: { title: artworkInTitle } }
                    )
                }
            }
        }

        const usernameForCreator = creatorName.split(' ').join('')
        const nonceCreators = Math.floor(Math.random() * 1000000)
        const userRequest = await Users.findOne({
            where: {
                public_address: addressInLower,
            },
        })

        if (!userRequest) {
            await Users.findOrCreate({
                where: {
                    name: creatorName,
                    username: usernameForCreator,
                    public_address: addressInLower,
                    nonce: nonceCreators,
                    creator: true
                },
            })
        } else {
            await Users.update({
                creator: true
            }, {
                where: {
                    public_address: addressInLower
                }
            })

        }
    })
}
