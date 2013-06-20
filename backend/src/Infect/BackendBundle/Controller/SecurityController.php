<?php

namespace Infect\BackendBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template,
	Symfony\Component\Security\Core\SecurityContext;

class SecurityController extends Controller 
{

	/**
     * @Route()
     * @Template()
     */
	public function loginAction() 
    {

    	$request = $this->getRequest();
        $session = $request->getSession();

        // get the login error if there is one
        if ($request->attributes->has(SecurityContext::AUTHENTICATION_ERROR)) {
            $error = $request->attributes->get(
                SecurityContext::AUTHENTICATION_ERROR
            );
        } else {
            $error = $session->get(SecurityContext::AUTHENTICATION_ERROR);
            $session->remove(SecurityContext::AUTHENTICATION_ERROR);
        }

    	return array(
    			'last_username' => $session->get(SecurityContext::LAST_USERNAME),
                'error'         => $error,
    		);
    }


}