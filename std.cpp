#include<iostream>
using namespace std;
int n,a,b;
int main(){
	cin>>n;
	for(int i=1;i<=n;i++){
		cin>>a;
		b=b^a;
	}
	cout<<b<<endl;
	return 0;
}