import ArticleImage from './ArticleImage'

export default interface ArticleModel {
  id?: string
  storyId?: string
  entryDate?: string
  title: string
  note: string
  images: Array<ArticleImage>
}
