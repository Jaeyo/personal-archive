import React, { FC, useEffect } from "react"
import { useHistory } from "react-router-dom"
import { useRequestFindArticleTags } from "../../apis/ArticleTagApi"
import { Treebeard } from "react-treebeard"
import { Loading } from "@kiwicom/orbit-components"
import NavItem from "../common/NavItem"
import { useSubscribe } from "../../common/Hooks"
import { ReloadTagTree } from "../../common/EventBus"


const ArticleTagTreeNav: FC = () => {
  const [fetching, findArticleTags, articleTags, untaggedCount, allCount] = useRequestFindArticleTags()

  useEffect(() => {
    findArticleTags()
  }, [findArticleTags])

  useSubscribe(ReloadTagTree, () => findArticleTags())

  if (fetching) {
    return <Loading type="boxLoader" />
  }

  const nodes = [] as TreeNode[]
  if (allCount > 0) {
    appendTreeNode(nodes, 'all', 'all', allCount)
  }
  if (untaggedCount > 0) {
    appendTreeNode(nodes, 'untagged', 'untagged', untaggedCount)
  }
  articleTags.forEach(articleTag => appendTreeNode(nodes, articleTag.tag, articleTag.tag, articleTag.count))

  return (
    <Treebeard
      data={nodes}
      decorators={{
        Loading: props => null,
        Toggle: props => null,
        Header: props => null,
        Container: props => <TreeNodeContainer name={props.node.name} tag={props.node.tag} />
      }}
      style={{
        tree:{
          base: {
            backgroundColor: 'transparent',
          },
        }
      }}
    />
  )
}

const TreeNodeContainer: FC<{ name: string, tag: string }> = ({ name, tag }) => {
  const history = useHistory()

  if (tag.length === 0) {
    return <NavItem role="button">{name}</NavItem>
  }

  return (
    <NavItem
      role="button"
      onClick={() => history.push(`/tags/${encodeURIComponent(tag)}`)}
    >
      {name}
    </NavItem>
  )
}

interface TreeNode {
  tag: string  // ex. parent/realName
  count: number  // ex. 3
  innerName: string  // ex. realName
  name: string // ex. realName (3)
  children: TreeNode[]
  toggled: boolean
}

const appendTreeNode = (nodes: TreeNode[], tag: string, name: string, count: number) => {
  name = refineNodeName(name)
  if (name.length === 0) {
    return
  } else if (name.indexOf('/') >= 0) {
    const parentInnerName = name.substring(0, name.indexOf('/'))
    const childInnerName = name.substring(name.indexOf('/') + 1)

    const parentFiltered = nodes.filter(node => node.innerName === parentInnerName)
    let parentNode: TreeNode
    if (parentFiltered.length === 0) {
      parentNode = {
        tag: '',
        count: 0,
        innerName: parentInnerName,
        name: parentInnerName,
        children: [],
        toggled: true,
      }
      nodes.push(parentNode)
    } else {
      parentNode = parentFiltered[0]
    }

    appendTreeNode(parentNode.children, tag, childInnerName, count)
    return
  }

  const filtered = nodes.filter(node => node.innerName === name)
  if (filtered.length === 0) {
    nodes.push({
      tag,
      count,
      innerName: name,
      name: `${name} (${count})`,
      children: [],
      toggled: true,
    })
    return
  }

  const found = filtered[0]
  found.count = count
  found.name = `${name} (${count})`
}

const refineNodeName = (name: string): string => {
  while (name.startsWith('/') || name.endsWith('/')) {
    if (name.startsWith('/')) {
      name = name.substring(1)
    } else if (name.endsWith('/')) {
      name = name.substring(0, name.length - 1)
    }
  }

  return name
}

export default ArticleTagTreeNav
