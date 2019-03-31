#include <iostream>
#include <queue>
#define inf 214783646
using namespace std;
struct ed{
	int u,w,next;
}e[5000000];
int st,fir[2000000],w[2000000],n,m,t,sx,sy,tx,ty,x,y,g[2000][2000];
int d[2000000];
queue<int> q; bool v[2000000];

void add(int x,int y){e[++st].u=y; e[st].next=fir[x]; fir[x]=st; }
bool pan(int x,int y){return (g[x][y]!=-1);}
int num(int x,int y) { return x*(m-1)+y; } //编号处理 

void spfa(int bb)
{
    for (int i=1;i<=n*m+1;i++) d[i]=inf/2,v[i]=0;
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
	for (int j=1;j<=m;j++)  if (g[i][j]!=-1){	//不是限制点 
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