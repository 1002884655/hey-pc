
import Api from '../../util/Api'
import ToolClass from '../../util/PublicMethod'

export default {
  namespaced: true,
  state: {
    MyCreatedPlaylist: [] // 我创建的片单列表
  },
  mutations: {
    UpdateMyCreatedPlaylist (state, data) { // 更新片单列表
      state.MyCreatedPlaylist = data.list || []
    },
    EditMyCreatedPlaylist (state, data) { // 编辑片单列表信息
      state.MyCreatedPlaylist[data.index][data.name] = data.value
    },
    AddMyCreatedPlaylist (state, data) { // 新增片单列表信息
      state.MyCreatedPlaylist.unshift(data)
    },
    DeleteMyCreatedPlaylist (state, data) { // 删除片单
      console.log(data)
      state.MyCreatedPlaylist.map((item, index) => {
        if (item.id - 0 === data.id) {
          state.MyCreatedPlaylist.splice(index, 1)
        }
      })
    }
  },
  actions: {
    RemoveFromDefaultPlaylist (context, payload) { // 从默认片单中移除视频
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.Playlist.RemoveFromDefaultPlaylist, context, payload, 0)
      })
    },
    SaveToDefaultPlaylist (context, payload) { // 添加到默认片单
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.Playlist.SaveToDefaultPlaylist, context, payload, 0)
      })
    },
    GetOtherUserPlaylist (context, payload) { // 获取其他用户片单（过滤隐私片单）
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.Playlist.GetOtherUserPlaylist, context, payload, 0)
      })
    },
    SavePlaylist (context, payload) { // 收藏片单
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.Playlist.SavePlaylist, context, payload, 0)
      })
    },
    GetPlaylistInfoById (context, payload) { // 获取片单信息
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.Playlist.GetPlaylistInfoById, context, payload, 0)
      })
    },
    RemoveSavePlaylist (context, payload) { // 移除收藏片单
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.Playlist.RemoveSavePlaylist, context, payload, 0)
      })
    },
    DeletePlaylist (context, payload) { // 删除片单
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.Playlist.DeletePlaylist, context, payload, 0, 'DeleteMyCreatedPlaylist', payload.params)
      })
    },
    CopyAllToPlaylist (context, payload) { // 整体添加视频到片单
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.Playlist.CopyAllToPlaylist, context, payload, 0)
      })
    },
    EditPlaylist (context, payload) { // 编辑片单
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.Playlist.EditPlaylist, context, payload, 0)
      })
    },
    AddPlaylist (context, payload) { // 添加片单
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.Playlist.AddPlaylist, context, payload, 0)
      })
    },
    RemoveFromPlaylist (context, payload) { // 从片单移除视频
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.Playlist.RemoveFromPlaylist, context, payload, 0)
      })
    },
    AddToPlaylist (context, payload) { // 添加视频到片单
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.Playlist.AddToPlaylist, context, payload, 0)
      })
    },
    GetCheckPlaylist (context, payload) { // 获取校验收藏片单
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.Playlist.GetCheckPlaylist, context, payload, 0, 'UpdateMyCreatedPlaylist')
      })
    },
    GetPlaylist (context, payload) { // 获取用户片单列表
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.Playlist.GetPlaylist, context, payload, 0, 'UpdateMyCreatedPlaylist')
      })
    },
    GetSavePlaylist (context, payload) { // 获取用户收藏片单列表
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.Playlist.GetSavePlaylist, context, payload, 0)
      })
    },
    GetPlaylistChildList (context, payload) { // 获取片单下列表
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.Playlist.GetPlaylistChildList, context, payload, 0)
      })
    }
  }
}
