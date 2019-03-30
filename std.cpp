#include <iostream>
using namespace std;
int n,m,map[1010][1010],insx,insy;
bool pd[1010][1010];
int search(int x,int y){
	if (map[x][y]==-3) return 0;
	pd[x][y]=true;
	int ans=99999999;
	if (x<n)
		if (!pd[x+1][y]&&map[x+1][y]!=-1)
			ans=min(ans,search(x+1,y));
	if (y<m)
		if (!pd[x][y+1]&&map[x][y+1]!=-1)
			ans=min(ans,search(x,y+1));
	if (x>1)
		if (!pd[x-1][y]&&map[x-1][y]!=-1)
			ans=min(ans,search(x-1,y));
	if (y>1)
		if (!pd[x][y-1]&&map[x][y-1]!=-1)
			ans=min(ans,search(x,y-1));
	pd[x][y]=false;
	return ans+map[x][y]+1;
}
int main(){
	cin>>n>>m;
	for(int i=1;i<=n;i++)
		for(int j=1;j<=n;j++){
			cin>>map[i][j];
			if (map[i][j]==-2){
				insx=i;
				insy=j;
			}
		}
	cout<<search(insx,insy)+2<<endl;
	return 0;
#include <iostream>
#include <queue>
using namespace std;

struct ed{
    int u,w,next;
}e[5000000]; //关于边的数量，由于每个点均摊会有2条边，所以是够存的。。
int st,fir[2000000],w[2000000],n,m,t,sx,sy,tx,ty,x,y,g[10][10];
int d[2000000];
queue<int> q; bool v[2000000];

void add(int x,int y){e[++st].u=y; e[st].next=fir[x]; fir[x]=st; }
bool pan(int x,int y)
{
    return (g[x][y]!=-1);
}
int num(int x,int y) { return x*(m-1)+y; } //编号处理 

void spfa(int bb)
{
    for (int i=1;i<=n*m+1;i++) d[i]=0x3f,v[i]=0;
    q.push(bb); v[bb]=1; d[bb]=0;
    while (!q.empty())
    {
        int k=q.front(); q.pop();  v[k]=0;
        for (int i=fir[k];i;i=e[i].next){
            int u=e[i].u;
            if (d[u]>d[k]+w[u]){
                d[u]=d[k]+w[u]; if (!v[u]) v[u]=1,q.push(u);
            }
        }
    } 
}

int main()
{
    cin>>n>>m;
    for (int i=1;i<=n;i++)
    for (int j=1;j<=m;j++) cin>>g[i][j];
    for (int i=1;i<=n;i++)
    for (int j=1;j<=m;j++) if (g[i][j]!=-1){    //不是限制点 
        if (g[i][j]==-2) sx=i,sy=j;
        if (g[i][j]==-3) tx=i,ty=j;
        if (i>1&&pan(i-1,j)) add(num(i,j),num(i-1,j)); //判断边界，判断限制点 
        if (i<n&&pan(i+1,j)) add(num(i,j),num(i+1,j));
        if (j>1&&pan(i,j-1)) add(num(i,j),num(i,j-1));
        if (j<m&&pan(i,j+1)) add(num(i,j),num(i,j+1));
        if (g[i][j]>=0) w[num(i,j)]=g[i][j]+1; else w[num(i,j)]=0;
        //改为点权 
    }

    spfa(num(sx,sy)); cout<<d[num(tx,ty)]+1<<endl; 
}
