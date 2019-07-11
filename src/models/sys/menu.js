import memoizeOne from 'memoize-one';
import isEqual from 'lodash/isEqual';
import { formatMessage } from 'umi-plugin-react/locale';
import Authorized from '@/utils/Authorized';
import { menu } from '../../defaultSettings';
import { queryCurrent,getMenuTreeList,saveMenuInfo,editMenuInfo,deleteMenuById } from '@/services/sys/menu';
import { message } from 'antd';

const { check } = Authorized;

// Conversion router to menu.
function formatter(data, parentAuthority, parentName) {
  if (!data) {
    return undefined;
  }
  return data
    .map(item => {
      if (!item.name || !item.path) {
        return null;
      }

      let locale = 'menu';
      if (parentName && parentName !== '/') {
        locale = `${parentName}.${item.name}`;
      } else {
        locale = `menu.${item.name}`;
      }
      // if enableMenuLocale use item.name,
      // close menu international
      const name = menu.disableLocal
        ? item.name
        : formatMessage({ id: locale, defaultMessage: item.name });
      const result = {
        ...item,
        name,
        locale,
        authority: item.authority || parentAuthority,
      };
      if (item.routes) {
        const children = formatter(item.routes, item.authority, locale);
        // Reduce memory usage
        result.children = children;
      }
      delete result.routes;
      return result;
    })
    .filter(item => item);
}

const memoizeOneFormatter = memoizeOne(formatter, isEqual);

/**
 * get SubMenu or Item
 */
const getSubMenu = item => {
  // doc: add hideChildrenInMenu
  if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
    return {
      ...item,
      children: filterMenuData(item.children), // eslint-disable-line
    };
  }
  return item;
};

/**
 * filter menuData
 */
const filterMenuData = menuData => {
  if (!menuData) {
    return [];
  }
  return menuData
    .filter(item => item.name && !item.hideInMenu)
    .map(item => check(item.authority, getSubMenu(item)))
    .filter(item => item);
};
/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 */
const getBreadcrumbNameMap = menuData => {
  if (!menuData) {
    return {};
  }
  const routerMap = {};

  const flattenMenuData = data => {
    data.forEach(menuItem => {
      if (menuItem.children) {
        flattenMenuData(menuItem.children);
      }
      // Reduce memory usage
      routerMap[menuItem.path] = menuItem;
    });
  };
  flattenMenuData(menuData);
  return routerMap;
};

const memoizeOneGetBreadcrumbNameMap = memoizeOne(getBreadcrumbNameMap, isEqual);

export default {
  namespace: 'menu',

  state: {
    menuData: [],
    routerData: [],
    breadcrumbNameMap: {},
    menuTreeList: {
      list: [],
      pagination: {
        current: 1,
        total: 0,
        pageSize: 10, 
      },
     },
  },

  effects: {
    *getMenuData({ payload }, { call,put }) {
      const result = yield call(queryCurrent, payload);
      const { routes, authority, path } = payload;
      const originalMenuData = memoizeOneFormatter(routes, authority, path);
      const menuData = result.menuList;
      const breadcrumbNameMap = memoizeOneGetBreadcrumbNameMap(originalMenuData);
      yield put({
        type: 'save',
        payload: { menuData, breadcrumbNameMap, routerData: routes },
      });
    },
    *getMenuTreeList({ payload }, { call,put }){
      const result = yield call(getMenuTreeList, payload);
      yield put({
        type: 'updateMenuTreeList',
        payload: {
          list: result,
          pagination: { current: 1, total: 3, pageSize: 10 },
        },
      });
    },
    *saveMenuInfo({ payload }, { call, put }){
      const parentId=payload.parentId;
      if(parentId==null){
        payload.parentId="0";
      }
      const result = yield call(saveMenuInfo, payload);
      message.success("新增菜单成功！！", 10);
    },
    *editMenuInfo({ payload }, { call, put }){
      if(payload.parentId==='根目录'){
        payload.parentId="0";
      }
      const result = yield call(editMenuInfo, payload);
      message.success("修改菜单成功！！", 10);
    },
    *deleteMenuById({ payload }, { call, put }){
      const result = yield call(deleteMenuById, payload);
      message.success("删除菜单成功！！", 10);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    updateMenuTreeList(state, { payload }) {
        return { ...state, menuTreeList: payload };
    },
  },
};
