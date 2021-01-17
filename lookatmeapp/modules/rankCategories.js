
class RankCategories {
    constructor() {

    }

    filterCategories = (allCategories, userRankCategories) => {

        let tempAllCategories = []
        allCategories.forEach((item, index, arr) => {
            if (userRankCategories.findIndex(item2 => item2.id == item.id) == -1) {
                tempAllCategories.push(item)
            }
        })
        return [...tempAllCategories]
    }

    addPictureToUserCategory = (allCategories, userRankCategories) => {
        userRankCategories.forEach((item, index, arr) => {
            let i = allCategories.findIndex(item2 => item.id == item2.id)
            if(i!=-1){
                  arr[index].picture=[...allCategories[i].picture]
            }
        })
        return [...userRankCategories]
    }

    addSelectedCategory = (categoryId, rankCategories, disableCategories) => {
        let index = disableCategories.findIndex(item => item.id == categoryId)


        if (index > -1) {
            if (!rankCategories.length > 0) {
                disableCategories[index].rank = 1
                rankCategories.push(disableCategories[index])
                disableCategories.splice(index, 1)
            } else {
                rankCategories.sort((a, b) => a.rank - b.rank)
                disableCategories[index].rank = rankCategories[rankCategories.length - 1].rank + 1
                rankCategories.push(disableCategories[index])
                disableCategories.splice(index, 1)
                rankCategories.sort((a, b) => a.rank - b.rank)
            }
        }
    }

    removeSelectedCategory = (categoryId, rankCategories, disableCategories) => {
        let index = rankCategories.findIndex(item => item.id == categoryId)


        if (index > -1) {
            rankCategories[index].rank = false
            disableCategories.push(rankCategories[index])
            rankCategories.splice(index, 1)
            rankCategories.sort((a, b) => a.rank - b.rank)
            for (let i = 0; i < rankCategories.length; i++) {
                rankCategories[i].rank = i + 1
            }
            rankCategories.sort((a, b) => a.rank - b.rank)
        }
    }
    rankByColors = () => {

    }
}

let rC = new RankCategories()

export default rC

