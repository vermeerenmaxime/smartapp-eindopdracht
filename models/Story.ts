import Article from './Article'

export default interface StoryModel {
  id?: string
  entryDate?: string
  author: string
  description: string
  image: string
  imageName?: string
  likes: string
  private: boolean
  title: string
  lat?: string
  long?: string
  // articles: Array<Article>
}
