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
      this.who_won=this.who_won.bind(this);
   }

   who_won()
   {
      return (this.state.player_no)?'Player2 won':'Player1 won';
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

   shouldComponentUpdate()
   {
      if(this.state.won)
         return false;
      return true;
   }

   changeval(id)
   {
      
      
      if(this.state.arr[id]!==undefined)
      return;
      
      let tmp=this.state.arr;
      tmp[id]=(this.state.player_no)?'X':'O';
      this.setState({arr:tmp});
   
      let winning=this.calcWinner();
      if(winning[0]!==-1)
      {
         console.log(winning);
         let result=this.who_won();
         this.setState({won:result});
         return;
      }

      this.setState({player_no:!this.state.player_no});
   }


   renderSquare(index,winning)
   {
      return <Square key={index} input={this.state.arr[index]} check_winning={winning} id={index} changeprop={this.changeval}/>
   }


   render()
   {
      let winning=this.calcWinner();
      let status=(this.state.player_no)?'Player2 ':'Player1 ';

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