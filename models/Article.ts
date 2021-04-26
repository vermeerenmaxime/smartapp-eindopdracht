import ArticleImage from './ArticleImage'

export default interface ArticleModel {
  id?: string
  storyId?: string
  entryDate: Date
  title: string
  note: string
  images: Array<ArticleImage>
}
