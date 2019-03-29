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
}