import React from 'react';
import reactDom from 'react-dom';
import styles from './app.module.css'


class Game extends React.Component{
   constructor(props)
   {
      super(props);
      this.state={arr:[undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined],player_no:false,won:false};
      this.changeval=this.changeval.bind(this);
      this.renderSquare=this.renderSquare.bind(this);
      this.calcWinner=this.calcWinner.bind(this);
      
      this.user='X';
      this.bot='O';
   }

   shouldComponentUpdate()
   {
      if(this.state.won)
         return false;
      return true;
   }

   calcWinner() {
      const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];
      for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if ((this.state.arr[a]==='X' || this.state.arr[a]==='O' ) && this.state.arr[a] === this.state.arr[b] && this.state.arr[a] === this.state.arr[c]) {
          return [a,b,c];
        }
      }
      return [-1,-1,-1];
   }

   assign_points(a,b)
   {
      let arr=[...b]
      arr.splice(a,1);

      if(arr.includes(this.bot))
      {
         if(arr.includes(this.user))  
            return 0;                  //useless

         else if(arr.includes(undefined))
            return 1;                  //empty fill
         else
            return 100;                //winning move
      }

      if(arr.includes(this.user))
      {
         if(arr.includes(this.bot))    
            return 0;                     //useless
         else if(arr.includes(undefined)) 
            return 2;                     //break the chain
         else
            return 50;                    //counter winning move
      }

      return 0;                           //untouched
   }


   piro_move(tmp)
   {
      let maxpoints=0;
      let maxpos=[-1,-1];
      let tmparr=[];

      for(let i=0;i<3;i++)
      {   
         let subarr=[]
         for(let j=0;j<3;j++)
         {
            subarr.push(tmp[i*3+j]);
         }
         tmparr.push(subarr);
      }

      for(let i=0;i<3;i++)
      {
         for(let j=0;j<3;j++)
         {
            if(tmparr[i][j])
               continue;

            let t=0;

            t+=this.assign_points(j,tmparr[i]);
            t+=this.assign_points(i,[tmparr[0][j],tmparr[1][j],tmparr[2][j]]);

            if(i===j)
               t+=this.assign_points(i,[tmparr[0][0],tmparr[1][1],tmparr[2][2]]);

            if(i+j===2)
               t+=this.assign_points(i,[tmparr[0][2],tmparr[1][1],tmparr[2][0]]);
            
            if(t>maxpoints)
            {
               maxpos=[i,j];
               maxpoints=t;
            }
         }
      }

      if(maxpos===[-1,-1])
      {
         console.log("changed");
         let pos=tmp.findIndex((i)=>{return i===undefined});
         return pos;
      }

      console.log(maxpos[0],maxpos[1]);
      return maxpos[0]*3+maxpos[1];
   }



   changeval(id)
   {
      
      if(this.state.arr[id]!==undefined)
      return;
      
      let tmp=this.state.arr;
      tmp[id]='X';
      
      let move=this.piro_move(tmp);
      if(move<0)
         this.setState({won:"Tie"});

      tmp[move]='O';

      this.setState({arr:tmp});
   
      let winning=this.calcWinner();
      if(winning[0]!==-1)
      {
         console.log(winning);
         
         let result=this.state.arr[winning[0]]==='X'?'Player won':'Bot won';

         this.setState({won:result});
         return;
      }
   }




   renderSquare(index,winning)
   {
      return <Square key={index} input={this.state.arr[index]} check_winning={winning} id={index} changeprop={this.changeval}/>
   }



   render()
   {
      let winning=this.calcWinner();
      let status="";

      if(this.state.won)
         status=this.state.won;
      
      return (
         <div>
            <div className="board-row">
               {this.renderSquare(0,winning)}
               {this.renderSquare(1,winning)}
               {this.renderSquare(2,winning)}
            </div>
            <div style={{top:100,position:"absolute"}}>
               {this.renderSquare(3,winning)}
               {this.renderSquare(4,winning)}
               {this.renderSquare(5,winning)}
            </div>
            <div style={{top:200,position:"absolute"}}>
               {this.renderSquare(6,winning)}
               {this.renderSquare(7,winning)}
               {this.renderSquare(8,winning)}
            </div>
            <h2 className={styles.status}>{status}</h2>
         </div>
      );
   }
}



class Square extends React.Component{
   render()
   {
      let style_for_this=styles.normal;
      
      //console.log(this.props.check_winning,this.props.id);
      if(this.props.check_winning.find((i)=>(i===this.props.id))!==undefined)
      {
         //console.log(this.props.check_winning.find((i)=>(i===this.props.id)));
         style_for_this=styles.won;
         
      }

      return (<div className={styles.square} onClick={()=>{this.props.changeprop(this.props.id)}}>
                  <p className={style_for_this}>{this.props.input}</p>
         </div>);
   }
}


reactDom.render(<Game/>,document.getElementById('root'));