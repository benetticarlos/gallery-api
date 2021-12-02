import app from './app'
import { getAllEventsRecursive } from './db/migrations/collectEvents'
import { getAllCollectionsRecursive } from './db/migrations/collectExhibitions'
import { GalleryItems } from './db/migrations/collectGallery'
import { readCreators } from './db/migrations/collectArtists'
import { sequelize } from './db/database'
const port = process.env.PORT || 3000

app.listen(port, async () => {
  console.log(`Server running on port ${port}`)
  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.')
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err)
    })
  await getAllEventsRecursive()
  await GalleryItems.AccountCollectionArtworks()
  await getAllCollectionsRecursive()
  await readCreators()
})
