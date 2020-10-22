		var img="box.png";
		var img2="kitties.png";

		var rowcellsize=5;//가로 셀 사이즈 (난이도)
		var timer=10;//남은시간 타이머
		var pretimeid=null;//게임시작전 파란키티 보는시간
		var gametimeid=null;//게임시간
		var kitty=10;//키티 수
		var wrongkitty=0;

		function setgamemode(){//웹열었을때 기본세팅
			remain(kitty);
			time(20);
			wrong(wrongkitty);
			message("게임이 진행될 예정입니다.");


			var p=document.getElementById('screen');
			var table=document.createElement("table");
			table.id="table";
			p.appendChild(table);
		}
		function setlevel(){//난이도 설정 및 테이블 생성
			//이전 게임 삭제
			var tb=document.getElementById("table");
			tb.parentNode.removeChild(tb);
			var h =document.getElementById("menu5");
			h.innerText="힌트";

			//난이도 설정
			var wrong=true;
			while(wrong){
				var level = prompt("냥이찾기 게임을 시작합니다. 제한시간내에 숨어있는 냥이를 찾으세요.\n힌트는 단한번 사용할 수 있습니다."
							+"\n난이도 (상,중,하)중 하나를 입력해주세요."
							+"\n난이도 상:5x10 실패한도 20"
							+"\n난이도 중:5x7 실패한도 14 \n난이도 하:5x4 실패한도 8");
				if(level=='상'){rowcellsize=10; kitty=20}
				else if(level=='중'){rowcellsize=7; kitty=12}
				else if(level=='하'){rowcellsize=4; kitty=8}
				else {alert("(상,중,하) 중 하나만 한글로 입력하세요."); continue;}
				wrong=false;
			}
			//테이블 생성
			var p=document.getElementById('screen');
			var table=document.createElement("table");
			table.id="table";
			p.appendChild(table);
			for(var i=0; i<5; i++){
				var tr=document.createElement("tr");
				table.appendChild(tr);
				for(var j=0; j<rowcellsize; j++){
					var td=document.createElement("td");		
					td.style.padding="0px";
					tr.appendChild(td);
				}
			}
			tds=document.getElementsByTagName("td");
			for(j=0;j<tds.length;j++){
				tds[j].innerHTML+=("<img class='normal' src='"+img+"'>");//일반키티는 normal
			}
			
			
		}
		function gamestart(){//게임 시작버튼 눌렀을때 실행
			setlevel();//난이도 설정및 게임 생성
			//힌트버튼 활성화
			

			timer=10;
		    wrongkitty=0;
			makenewKitty();//랜덤으로 키티 생성
			remain(kitty);
			wrong(wrongkitty);


			document.getElementById("menu1").style.display="none";//게임시작 버튼 삭제
			message("숨은 그림을 보세요");
			//숨은 그림 이미지 나타내기( 클릭안되게)
			var hidden = document.getElementsByClassName('hidden');
			for(i=0;i<hidden.length;i++){
				hidden[i].src=img2;
			}

			

			pretimeid = setInterval(function(){
				time();
				if(timer<0){
					clearInterval(pretimeid);
					message("정답을 찾으세요");
					//그림 이미지 다 바꾸기 그리고 클릭 설정하기
					var imgs = document.getElementsByTagName("img");
					var h =document.getElementById("menu5");
					h.onclick=hint;

					for(i=0;i<imgs.length;i++){////중복 처리안함
						imgs[i].src=img;
						imgs[i].onclick=function(event){
							if(this.className=='hidden'){
								this.src=img2;
								kitty-=1;
								remain(kitty);
								this.onclick=null;
								this.className="found";//찾음
							}
							else{
								wrongkitty+=1;
								wrong(wrongkitty);
								this.onclick=null;
							}
						};
						
					}
					timer=60;
					gametimeid=setInterval('gametime()',1000);

				}
			}, 1000);
		
		}
		function gametime(){
			time();
			//if 다 찾았을때 / 시간초과 했을 때
			if(kitty==0 || timer<0 ||wrongkitty >= rowcellsize*2){
				clearInterval(gametimeid);
				document.getElementById("menu1").style.display="block";//시작메뉴 활성화
				var imgs = document.getElementsByTagName("img");
				for(i=0;i<imgs.length;i++){//게임끝난후 카운트 종료
					imgs[i].onclick=null
				}
				if(kitty==0){
					message("성공");
					//성공 이미지 띄우기

				}
				else if(timer<0 ||wrongkitty >= rowcellsize*2){
					message("실패");
					//gameover 이미지 띄우기 

					//찾지 못한 키티 테두리선 표시하기
					var remainkitty=document.getElementsByClassName("hidden");
					for(i=0; i<remainkitty.length;i++){
						remainkitty[i].src=img2;							
						remainkitty[i].parentNode.style.border="1px solid red";
					}

				}				
			}

		}
		function makenewKitty(){//시작시 랜덤으로 키티 만드는 함수
			var array= new Array();//파란키티들 위치 저장할 배열
			i=0; 
			while(i<kitty){
				var a=Math.floor(Math.random() * (rowcellsize*5-1) );
				if(!array.includes(a)){//이미 지정된 위치가 아닐때
					array[i]=a;
					i++;
				}
			}
			tds=document.getElementsByTagName("td");
			imgs=document.getElementsByTagName("img");
			for(j=0;j<imgs.length;j++){
				if(array.includes(j)){
					imgs[j].className="hidden";
				}		
				else
					imgs[j].className="normal";
					
			}
				
		}
		function remain(num){
			document.getElementById("menu2").innerText="남은 수 : "+num;
		}
		function time(){
			document.getElementById("menu3").innerText="시간 : "+timer;
			timer--;
		}
		function wrong(num){
			document.getElementById("menu4").innerText="실패 수 : "+num+"/"+(rowcellsize*2);
		}
		function message(text){
			document.getElementById("menu6").innerText=text;
		}
		function hint(){
			var h =document.getElementById("menu5");
			h.innerText="힌트 사용 완료";
			h.onclick=null;
			var hidden = document.getElementsByClassName('hidden');
			for(i=0;i<hidden.length;i++)
				hidden[i].src=img2;
			
			setTimeout(function() {  
				for(i=0;i<hidden.length;i++)
					hidden[i].src=img;
			}, 500);//0.5초 지연

			

		}
		