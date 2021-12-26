export function getDeptTreeData(departments, disabledKeys, whetherMap) {
  const mapIdToName = new Map();
  const deptTreeData = [];
  departments.forEach((dp) => {
    if (whetherMap) mapIdToName.set(dp.id, dp.name);
    if (!dp.parent_dept_id) {
      deptTreeData.push({
        title: dp.name,
        value: dp.id,
        key: dp.id,
      });
    }
  });
  let visitDeptData = [...deptTreeData];
  while (visitDeptData.length > 0) {
    const visit = visitDeptData.shift();
    const children = departments.filter(f => f.parent_dept_id === visit.key);
    if (disabledKeys && disabledKeys.includes(visit.key)) {
      visit.disabled = true;
    }
    if (children.length > 0) {
      const tempData = children.map(f => ({
        title: f.name,
        value: f.id,
        key: f.id,
      }));
      visit.children = tempData;
      visitDeptData = visitDeptData.concat(tempData);
    }
  }
  if (whetherMap) return { mapIdToName, deptTreeData };
  return deptTreeData;
}
