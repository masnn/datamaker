/*                        ..
                        .' @`._
         ~       ...._.'  ,__.-;
      _..- - - /`           .-'    ~
     :     __./'       ,  .'-'- .._
  ~   `- -(.-'''- -.    \`._       `.   ~
    _.- '(  .______.'.-' `-.`         `.
   :      `-..____`-.                   ;
   `.             ````  稻花香里说丰年，  ;   ~
     `-.__          听取人生经验。  __.-'
          ````- - -.......- - -'''    ~
       ~                   ~
-------------------------------------
|           Code by masnn           |
|      Email:masnn0@outlook.com     |
|            Do not copy            |
-----------------------------------*/
#include <iostream>
#include <queue>
using namespace std;
#define INF 99999999
struct pos {
    int x, y, dis;
} t;
struct node {
    int dis, w;
    bool p;
} map[1510][1510];
bool operator<(pos a, pos b) {
    return a.dis > b.dis;
}
queue<pos> ep;
bool err;
int dx[4] = { 0, 1, -1, 0 };
int dy[4] = { 1, 0, 0, -1 };
int n, m, ans, cnt;
priority_queue<pos> q;
void Solve() {
    pos c;
    register int i, x, y;
    while (!q.empty()) {
        c = q.top();
        q.pop();
        map[c.x][c.y].p = false;
        if (map[c.x][c.y].w == -1) continue;
        for (i = 0; i <= 3; i++) {
            x = c.x + dx[i];
            y = c.y + dy[i];
            if (map[x][y].w != 0)
                if (map[x][y].dis > map[c.x][c.y].dis + map[x][y].w) {
                    map[x][y].dis = map[c.x][c.y].dis + map[x][y].w;
                    if (!map[x][y].p) q.push({ x, y, map[x][y].dis });
                }
        }
    }
}
int main() {
    cin >> n >> m;
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++) {
            cin >> map[i][j].w;
            map[i][j].dis = INF;
            if (map[i][j].w == -1) {
                ep.push({ i, j, INF });
                map[i][j].w = 1;
            } else if (map[i][j].w == -2) {
                q.push({ i, j, 0 });
                map[i][j].dis = 0;
                map[i][j].w = 1;
                map[i][j].p = true;
            }
        }
    Solve();
    while (!ep.empty()) {
        t = ep.front();
        ep.pop();
        if (map[t.x][t.y].dis == INF)
            err = true;
        else
            cnt++;
        ans = max(ans, map[t.x][t.y].dis);
    }
    if (err)
        cout << cnt << endl;
    else
        cout << ans - 1 << endl;
    return 0;
}